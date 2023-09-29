import { CreateAnvilOptions } from '@viem/anvil'
import { mainnet } from 'viem/chains'

const ACTIVE_CHAIN = mainnet

export const CREATE_ANVIL_OPTIONS: CreateAnvilOptions = {
  forkChainId: ACTIVE_CHAIN.id,
  forkUrl: import.meta.env.VITE_ANVIL_MAINNET_FORK_ENDPOINT,
  forkBlockNumber: import.meta.env.VITE_ANVIL_MAINNET_FORK_BLOCK_NUMBER
    ? parseInt(import.meta.env.VITE_ANVIL_MAINNET_FORK_BLOCK_NUMBER)
    : undefined,
}

export const ANVIL_CONFIG = {
  TIMEOUT: 60000, // default 10000
  ACTIVE_CHAIN: ACTIVE_CHAIN,
}

export const ANVIL_COMMANDS = {
  // SET_ADDRESS_BYTECODE: 'cast rpc anvil_setCode 0x4e59b44847b379578588920ca78fbf26c0b4956c 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3',
  // SET_ADDRESS_BYTECODE: `cast rpc anvil_setCode ${ANVIL_ACCOUNTS[0].address} 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3`,
  // DEPLOY_REGISTRY:
  //   'forge script --fork-url http://127.0.0.1:8545 6551contracts/script/DeployRegistry.s.sol --broadcast',
  // DEPLOY_ACCOUNT_IMPLEMENTATION: `forge create 6551contracts/src/examples/simple/SimpleERC6551Account.sol:SimpleERC6551Account --rpc-url=$RPC_URL --private-key=$PRIVATE_KEY`,
  DEPLOY_ERC20_CONTRACT:
    'forge script --fork-url http://127.0.0.1:8545 src/contracts/script/DummyERC20.sol --broadcast',

  DEPLOY_ERC20: `forge create src/contracts/script/DummyERC20.sol:DummyERC20 --rpc-url=$RPC_URL --private-key=$PRIVATE_KEY`,
}
