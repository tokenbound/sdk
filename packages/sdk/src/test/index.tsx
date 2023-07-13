import { RenderOptions, render } from '@testing-library/react'
import { default as userEvent } from '@testing-library/user-event'
import * as React from 'react'

import {
  CreateConfigParameters,
  WagmiConfig,
  WagmiConfigProps,
  WalletClient,
  createConfig,
} from 'wagmi'
import { MockConnector } from 'wagmi/connectors/mock'

import { getMockWalletClient, getPublicClient } from './utils'

import { foundry } from 'viem/chains'

type SetupClient = Partial<CreateConfigParameters> & {
  walletClient?: WalletClient
}
export function setupConfig({
  walletClient = getMockWalletClient(),
  ...config
}: SetupClient = {}) {
  return createConfig({
    connectors: [new MockConnector({ options: { walletClient } })],
    publicClient: getPublicClient({ chainId: foundry.id }),
    ...config,
  })
}

type ProvidersProps = {
  children: React.ReactNode
  config?: WagmiConfigProps['config']
}
export function Providers({ children, config = setupConfig() }: ProvidersProps) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>
}

const renderWithWagmiConfig = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: Providers, ...options })

export * from '@testing-library/react'
export { renderWithWagmiConfig }

export type UserEvent = ReturnType<typeof userEvent.setup>
export { default as userEvent } from '@testing-library/user-event'

export { ADDRESS_REGEX, getMockWalletClient } from './utils'
