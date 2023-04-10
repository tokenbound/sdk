import { encodeFunctionData, encodeAbiParameters, Address } from "viem";
import accountJSON from "./abis/demoAccount.json";

interface ExecuteCallConfig {
  abi: any;
  functionName: string;
  args: unknown[];
  tokenBoundAccount: Address;
  value: BigInt;
}

export const encodeExecuteCall = async (
  abi: any,
  functionName: any,
  args: any,
  tokenBoundAccount: Address,
  value: BigInt
) => {
  const functionCallData = await encodeFunctionData({
    abi: abi,
    functionName: functionName,
    args: args,
  });

  const encodedExecutionData = encodeFunctionData({
    abi: accountJSON,
    functionName: "executeCall",
    args: [tokenBoundAccount, value, functionCallData],
  });

  return encodedExecutionData;
};
