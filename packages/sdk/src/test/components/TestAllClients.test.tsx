import * as React from 'react'
import { QueryClient } from '@tanstack/react-query'
import { assert, beforeEach, describe, expect, it } from 'vitest'
import { MockConnector } from 'wagmi/connectors/mock'

import {
  Providers,
  UserEvent,
  act,
  ADDRESS_REGEX,
  getMockWalletClient,
  renderWithWagmiConfig,
  screen,
  setupConfig,
  userEvent,
  waitFor,
} from '../mockWallet'
import { EthersSignerTester, Ethers6SignerTester, WalletClientTester } from './'
import { PublicClient, WebSocketPublicClient, Config, WalletClient } from 'wagmi'

describe('ComboTester', () => {
  runClientTxTestsForComponent('<EthersSignerTester />', EthersSignerTester)
  runClientTxTestsForComponent('<Ethers6SignerTester />', Ethers6SignerTester)
  runClientTxTestsForComponent('<WalletClientTester />', WalletClientTester)
})

function runClientTxTestsForComponent(
  componentName: string,
  TestComponent: React.ComponentType
) {
  describe(componentName, () => {
    let user: UserEvent
    let config: Config<PublicClient, WebSocketPublicClient> & {
      queryClient: QueryClient
    }

    beforeEach(async () => {
      act(() => {
        user = userEvent.setup()
        assert(user)
      })

      // Create a config with a mock wallet client (foundry chain)
      config = setupConfig({
        connectors: [
          new MockConnector({
            options: {
              walletClient: getMockWalletClient() as WalletClient,
            },
          }),
        ],
      })
      assert(config)

      // Render with a WagmiConfig wrapper, so we can test calls with the mock configuration
      renderWithWagmiConfig(<TestComponent />, {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <Providers config={config}>{children}</Providers>
        ),
      })

      act(() => {
        const connectButton = screen.getByTestId('connect-button') as HTMLButtonElement
        user.click(connectButton)
      })

      await waitFor(() => {
        expect(screen.getByText(ADDRESS_REGEX)).toBeInTheDocument()
        expect(
          screen.getByTestId('tb-create-account-button') as HTMLButtonElement
        ).toBeInTheDocument()
      })
    })

    it('can createAccount', async () => {
      act(() => {
        const createAccountButton = screen.getByTestId(
          'tb-create-account-button'
        ) as HTMLButtonElement

        // console.log('CREATE BUTTON', createAccountButton)

        user.click(createAccountButton)
      })

      await waitFor(() => {
        const tbAccountOutput = screen.getByTestId(
          'tb-account-created'
        ) as HTMLSpanElement

        // console.log('TB ACCOUNT OUTPUT', tbAccountOutput)

        expect(tbAccountOutput).toBeInTheDocument()
        expect(tbAccountOutput.textContent).toMatch(ADDRESS_REGEX)
      })
    })

    it('can executeCall', async () => {
      act(() => {
        const executeCallButton = screen.getByTestId(
          'tb-execute-call-button'
        ) as HTMLButtonElement
        user.click(executeCallButton)
      })

      await waitFor(() => {
        const tbExecutedCallOutput = screen.getByTestId(
          'tb-executed-call'
        ) as HTMLSpanElement
        expect(tbExecutedCallOutput).toBeInTheDocument()
        expect(tbExecutedCallOutput.textContent).toMatch(ADDRESS_REGEX)
      })

      // Oddly, if the mint tests come after the executeCall tests, the mint tests work
      act(() => {
        const executeMintButton = screen.getByTestId(
          'tb-mint-1155-button'
        ) as HTMLButtonElement

        // console.log('EXECUTE MINT BUTTON', executeMintButton)

        user.click(executeMintButton)
      })

      await waitFor(() => {
        const tbExecutedMintOutput = screen.getByTestId(
          'tb-executed-mint'
        ) as HTMLSpanElement
        expect(tbExecutedMintOutput).toBeInTheDocument()
      })
    })

    // it('can transfer an NFT', async () => {
    //   act(() => {
    //     const executeMintButton = screen.getByTestId(
    //       'tb-mint-1155-button'
    //     ) as HTMLButtonElement
    //     // console.log('EXECUTE MINT BUTTON', executeMintButton)
    //     user.click(executeMintButton)
    //   })
    //   await waitFor(() => {
    //     const tbExecutedMintOutput = screen.getByTestId(
    //       'tb-executed-mint'
    //     ) as HTMLSpanElement
    //     expect(tbExecutedMintOutput).toBeInTheDocument()
    //     // expect(tbExecutedCallOutput.textContent).toMatch(ADDRESS_REGEX)
    //   })
    // })
  })
}
