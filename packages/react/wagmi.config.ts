import { defineConfig } from "@wagmi/cli";
import { actions, react } from "@wagmi/cli/plugins";

import REGISTRY_ABI from "./abis/ERC6551Registry.json";
import ACCOUNT_ABI from "./abis/IERC6551Account.json";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [
    {
      abi: REGISTRY_ABI as any,
      address: "0x1472d0f5c6c151df96352ec271b8df1093370a7a",
      name: "ERC6551Registry",
    },
    {
      abi: ACCOUNT_ABI as any,
      name: "ERC6551Account",
    },
  ],
  plugins: [actions(), react()],
});
