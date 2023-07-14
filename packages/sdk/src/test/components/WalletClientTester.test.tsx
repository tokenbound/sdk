import * as React from 'react'
import { QueryClient } from '@tanstack/react-query'
import { assert, beforeEach, describe, expect, it } from 'vitest'
import { MockConnector } from 'wagmi/connectors/mock'
// import '@testing-library/jest-dom/extend-expect'

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
import { WalletClientTester } from './WalletClientTester'
import { PublicClient, WebSocketPublicClient, Config } from 'wagmi'

describe('<WalletClientTester />', () => {
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
            walletClient: getMockWalletClient(),
          },
        }),
      ],
    })
    assert(config)

    // Render with a WagmiConfig wrapper, so we can test calls with the mock configuration
    renderWithWagmiConfig(<WalletClientTester />, {
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
      user.click(createAccountButton)
    })

    await waitFor(() => {
      const tbAccountOutput = screen.getByTestId('tb-account-created') as HTMLSpanElement
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
  })
})
