export * from "./providers/wallet.ts";
export * from "./types/index.ts";

import type { Plugin } from "@elizaos/core";
import { evmWalletProvider } from "./providers/wallet.ts";
import { getSmilesAction } from "./actions/getSmiles.ts";

export const getSmilesPlugin: Plugin = {
  name: "getSmile",
  description: "Drug candidate or molecule analyzer aand IP NFT mintor plugin",
  providers: [evmWalletProvider],
  evaluators: [],
  services: [],
  actions: [getSmilesAction],
};

export default getSmilesPlugin;
