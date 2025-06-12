import * as viemChains from "viem/chains";
import { Hash, Address } from "viem";

const _SupportedChainList = Object.keys(viemChains) as Array<
  keyof typeof viemChains
>;
export type SupportedChain = (typeof _SupportedChainList)[number];

export interface GetSmilesParams {
  code: string;
  address: `0x${string}`;
  smiles: string;
  shouldMint: boolean;
  compound_name: string | null;
  description:string,
  context: string | null;
  target_disease: string | null;
}

export interface Transaction {
  hash: Hash;
  from: Address;
  to: Address;
  value: bigint;
  data?: `0x${string}`;
  chainId?: number;
}
