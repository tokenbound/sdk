import { RenderOptions, RenderResult, render } from '@testing-library/react'
import { default as userEvent } from '@testing-library/user-event'
import * as React from 'react'

import { WalletClient, PublicClient } from 'viem'

import {
  CreateConfigParameters,
  // WagmiConfig,
  // WagmiConfigProps,
  // WalletClient,
  // PublicClient,
  createConfig,
} from 'wagmi'
// import { createPublicClient, WalletClient, PublicClient, createWalletClient, http } from 'viem'
// import { MockConnector } from 'wagmi/connectors/mock'

// import { getMockWalletClient, getPublicClient } from './utils/clients'

// import { foundry } from 'viem/chains'

// type SetupClient = Partial<CreateConfigParameters> & {
//   walletClient?: WalletClient
// }
// export function setupConfig({
//   walletClient = getMockWalletClient() as WalletClient,
//   ...config
// }: SetupClient = {}): WagmiConfigProps['config'] {
//   return createConfig({
//     connectors: [new MockConnector({ options: { walletClient } })],
//     publicClient: getPublicClient({ chainId: foundry.id }) as PublicClient,
//     ...config,
//   })
// }

// type ProvidersProps = {
//   children: React.ReactNode
//   // config?: WagmiConfigProps['config']
//   config?: WagmiConfig['config']
//   config?: WagmiConfig['config']
// }
// export function Providers({ children, config = setupConfig() }: ProvidersProps) {
//   return <WagmiConfig config={config}>{children}</WagmiConfig>
// }

// const renderWithWagmiConfig = (
//   ui: React.ReactElement,
//   options?: RenderOptions
// ): RenderResult => render(ui, { wrapper: Providers, ...options })

export * from '@testing-library/react'
// export { renderWithWagmiConfig }

export type UserEvent = ReturnType<typeof userEvent.setup>
export { default as userEvent } from '@testing-library/user-event'

export { getMockWalletClient } from './utils'
export { ADDRESS_REGEX } from './constants'
