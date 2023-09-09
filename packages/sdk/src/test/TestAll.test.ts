// import * as React from 'react'
import { QueryClient } from '@tanstack/react-query'
import { assert, beforeEach, describe, expect, it } from 'vitest'
// import { MockConnector } from 'wagmi/connectors/mock'

import { foundry } from 'viem/chains'

import {
  // Providers,
  // UserEvent,
  // ADDRESS_REGEX,
  getMockWalletClient,
  // renderWithWagmiConfig,
  // screen,
  // setupConfig,
  // userEvent,
  waitFor,
} from './mockWallet'
// import { EthersSignerTester, Ethers6SignerTester, WalletClientTester } from './'
// import { PublicClient, WebSocketPublicClient, Config, WalletClient } from 'wagmi'
import { createAnvil,CreateAnvilOptions, getVersion as getAnvilVersion, startProxy, createProxy, createPool } from '@viem/anvil'
import { WalletClient, PublicClient } from 'viem'
import { getPublicClient } from './utils'
import { exec } from 'child_process' // Node.js child_process module

// @BJ TODO: figure out how to deal with viem + ethers + generate mnemonic wallets
describe('ComboTester', () => {
  runTxTestsWithSigner('BASE TEST')
  // runTxTestsWithSigner('<EthersSignerTester />', EthersSignerTester)
  // runTxTestsWithSigner('<Ethers6SignerTester />', Ethers6SignerTester)
  // runTxTestsWithSigner('<WalletClientTester />', WalletClientTester)
})

/**
 * Executes a shell command and returns the output as a promise.
 * 
 * @param cmd - The shell command to be executed.
 * @returns A promise that resolves with the command output (stdout or stderr).
 * @throws Will reject the promise with an error if the command execution fails.
 * 
 * @example
 * ```typescript
 * shellCommand('ls -l').then(console.log);
 * ```
 */
function shellCommand(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
          if (error) {
              console.warn(`Error executing command: ${cmd}`);
              reject(error);
              return;
          }
          // console.log('STDOUT', stdout) 
          // console.log('STDERR', stderr) 
          resolve(stdout || stderr);
      });
  });
}

// const TEST_TIMEOUT = 30000 // default 10000
const TEST_TIMEOUT = 120000 // default 10000
// const TEST_TIMEOUT = 240000 // default 10000

function runTxTestsWithSigner(
  signerName: string,
  // signerOrWalletClient
) {
  describe(signerName, () => {

    let publicClient: PublicClient
    let walletClient: WalletClient
    // let shutdown: any


    // @BJ TODO: figure out how to access ENV vars with vitest (these are coming out as undefined)
    const ANVIL_CONFIG: CreateAnvilOptions = {
      forkUrl: process.env.ANVIL_MAINNET_FORK_ENDPOINT,
      forkBlockNumber: process.env.ANVIL_MAINNET_FORK_BLOCK_NUMBER? parseInt(process.env.ANVIL_MAINNET_FORK_BLOCK_NUMBER):undefined, 
    }
    console.log('ANVIL_CONFIG',ANVIL_CONFIG)
    const anvil = createAnvil(
      {
        forkUrl: 'https://eth-mainnet.alchemyapi.io/v2/SMkQiSpoj4za3-0hO0eP78i3b0OrBT4k',
        forkBlockNumber: 17680029,
      }
      // {...ANVIL_CONFIG}
    )


    //@BJ TODO: change vitest environment: 'jsdom' to 'node' ?

    beforeEach(async () => {
      console.log('BEFORE_EACH --->')

      try {
        publicClient = getPublicClient({ chainId: foundry.id })
        walletClient = getMockWalletClient()

        // walletClient
        // user = userEvent.setup()
        // assert(user)


        console.log('ANVIL:', anvil)
        console.log('ANVIL VERSION:', await getAnvilVersion())
        console.log('ANVIL_STATUS:', anvil.status)
        console.log('ANVIL_LOGS:', anvil.logs)
        console.log('ANVIL_OPTIONS:', anvil.options)
        
        await anvil.start()
        // const start = await anvil.start()
        // console.log('ANVIL START:', start)


        // Returns a function to shut down the proxy and all spawned anvil instances.
        // const 
        // shutdown = await startProxy({
        //   port: 8555,
        //   options: {
        //     forkUrl: process.env.ANVIL_MAINNET_FORK_ENDPOINT!,
        //     forkBlockNumber: parseInt(process.env.ANVIL_MAINNET_FORK_BLOCK_NUMBER!),
        //   },
        // })

        // console.log('PROXY', shutdown)

        // const PROXY_PORT = 8545
        // shutdown.listen(PROXY_PORT, "::", () => {
        //   console.log(`Proxy server listening on http://0.0.0.0:${PROXY_PORT}`)
        // })

        // const server = await createProxy({
        //   pool: createPool(),
        //   options: {
        //     forkUrl: process.env.ANVIL_MAINNET_FORK_ENDPOINT!,
        //     forkBlockNumber: parseInt(process.env.ANVIL_MAINNET_FORK_BLOCK_NUMBER!),
        //     // forkUrl: 'https://eth-mainnet.alchemyapi.io/v2/SMkQiSpoj4za3-0hO0eP78i3b0OrBT4k',
        //     // forkBlockNumber: 17680029,
        //   },
        // })

        // // console.log('ENV', process.env.ANVIL_MAINNET_FORK_ENDPOINT, process.env.ANVIL_MAINNET_FORK_BLOCK_NUMBER), 

        // server.listen(8545, "::", () => {
        //   console.log("Proxy server listening on http://0.0.0.0:8545")
        // })
        
        // assert(anvil)
        // await shellCommand('anvil').then(console.log)
        
        // await shellCommand('ls -l').then(console.log)
        // shellCommand('ls -l').then(console.log)


        // How to:
        
        // Connect the wallet?

        // deploy the foundry create2 contract
        // deploy the ERC-6551 registry (v0.2.0 tag)
        // deploy the Tokenbound account implementation (v0.2.0)
        // Above 3 have a deployment guide in the docs

        // deploy the Mock ERC-721 token contract
        // deploy the Mock ERC-20 token contract
        // deploy the Mock ERC-1155 token contract

      } catch (err) {
          console.error('Error during setup:', err);
      }
      
    }, TEST_TIMEOUT)

    afterEach(async () => {
      await anvil.stop()
      // await shutdown()
      console.log('---> AFTER EACH')
    })

    //   const connectButton = screen.getByTestId('connect-button') as HTMLButtonElement
    //   user.click(connectButton)

    //   await waitFor(() => {
    //     expect(screen.getByText(ADDRESS_REGEX)).toBeInTheDocument()
    //     expect(
    //       screen.getByTestId('tb-create-account-button') as HTMLButtonElement
    //     ).toBeInTheDocument()
    //   })
    // })

    // it('can createAccount', async () => {
    //   await waitFor(() => {
    //     // account should match the address regex
    //     // expect(tbAccountOutput.textContent).toMatch(ADDRESS_REGEX)
    //   })
    // })

    // it('can executeCall', async () => {
    //   await waitFor(() => {
    //     // txHash should match the address regex
    //     // expect(tbExecutedCallOutput.textContent).toMatch(ADDRESS_REGEX)
    //   })
    // })
    // test.todo('remove when tests are added')
    it('should always pass', () => {
      expect(true).toBe(true)
    })
    
  })
}
