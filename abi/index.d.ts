// TypeScript definitions for ArcFactory Token Factory ABIs

export interface ContractAddresses {
  normalFactory: string;
  taxFactory: string;
}

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  currency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface Addresses {
  arcTestnet: ContractAddresses;
}

export interface Networks {
  arcTestnet: NetworkConfig;
}

export const ArcTokenFactory: any[];
export const ArcTaxTokenFactory: any[];
export const ArcToken: any[];
export const ArcTaxToken: any[];

export const addresses: Addresses;
export const networks: Networks;
