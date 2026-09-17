// @tokenbound/sdk — viem-first ERC-6551 SDK.
//
// Ethers v5/v6 support lives in the separate @tokenbound/ethers package, which
// builds on the same library-independent protocol layer exported here.

// Library-independent protocol layer: deterministic derivation and pure
// calldata encoding, usable without any client.
export {
	computeAccount,
	deconstructBytecode,
	encodeERC20Transfer,
	encodeETHTransfer,
	encodeExecuteCall,
	encodeExecution,
	encodeNFTTransfer,
	getAccountAddress,
	getCreationCode,
	hasBytecode,
	isCustomImplementation,
	type ProtocolDeploymentStatus,
	prepareCreateAccountTx,
	type ResolvedDeployment,
	resolveDeployment,
	toProtocolDeploymentStatus,
	VALID_SIGNER_MAGIC_VALUE,
} from "./protocol"
export {
	ERC_6551_DEFAULT,
	ERC_6551_LEGACY_V2,
	TOKENBOUND_V3_DEPLOYER_URL,
} from "./protocol/constants"

// Legacy standalone functions, retained for backwards compatibility.
export {
	createAccount,
	executeCall,
	getAccount,
	prepareCreateAccount,
	prepareExecuteCall,
} from "./protocol/functions"
export {
	erc6551AccountAbiV2,
	erc6551AccountAbiV3,
	erc6551AccountProxyAbiV3,
	erc6551RegistryAbiV2,
	erc6551RegistryAbiV3,
	TokenboundClient,
} from "./TokenboundClient"
export type {
	BytecodeParams,
	Call3,
	CallData,
	ComputeAccountParams,
	CreateAccountParams,
	ERC20TransferParams,
	ETHTransferParams,
	ExecuteCallParams,
	ExecuteParams,
	GetAccountParams,
	GetCreationCodeParams,
	MultiCallTx,
	NFTTransferParams,
	PossibleENSAddress,
	PrepareCreateAccountParams,
	PrepareExecuteCallParams,
	PrepareExecutionParams,
	Prettify,
	SegmentedERC6551Bytecode,
	SignMessageParams,
	TBAccountParams,
	TBImplementationVersion,
	TokenboundAccountNFT,
	TokenboundClientOptions,
	ValidSignerParams,
} from "./types"
export { CALL_OPERATIONS, TBVersion } from "./types"
