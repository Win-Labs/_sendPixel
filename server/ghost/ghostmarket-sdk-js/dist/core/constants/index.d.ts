import { ChainNetwork } from "@onblockio/gm-api-js";
export declare const GHOSTMARKET_TRADE_FEE_BPS = 200;
export declare const MIN_BID_INCREASE_BPS = 500;
export declare const ORDERBOOK_VERSION = 2;
export declare const API_BASE_MAINNET = "https://api.ghostmarket.io";
export declare const API_BASE_TESTNET = "https://api-testnet.ghostmarket.io";
export declare const API_BASE_DEV = "https://api-dev.ghostmarket.io";
export declare const SITE_HOST_MAINNET = "https://ghostmarket.io";
export declare const SITE_HOST_TESTNET = "https://testnet.ghostmarket.io";
export declare const API_PATH: string;
export declare const MAINNET_API_URL: string;
export declare const TESTNET_API_URL: string;
export declare const DEV_API_URL: string;
export interface ContractAddresses {
    EXCHANGE: string;
    INCENTIVES: string;
    GM_TOKEN: string;
    FLM_TOKEN?: string;
    LP_TOKEN?: string;
    LP_STAKING?: string;
    DEX?: string;
    ROYALTIES?: string;
    PROXY_NFT?: string;
    PROXY_ERC20?: string;
    WRAPPED_TOKEN?: string;
    GAS_TOKEN?: string;
    GHOST_NEP11?: string;
    GHOST_PEPE12?: string;
    GHOST_ERC721?: string;
    GHOST_ERC1155?: string;
    CONTRACT_MANAGEMENT?: string;
}
export declare const ETHEREUM_MAINNET_ADDRESSES: ContractAddresses;
export declare const ETHEREUM_TESTNET_ADDRESSES: ContractAddresses;
export declare const AVALANCHE_MAINNET_ADDRESSES: ContractAddresses;
export declare const AVALANCHE_TESTNET_ADDRESSES: ContractAddresses;
export declare const POLYGON_MAINNET_ADDRESSES: ContractAddresses;
export declare const POLYGON_TESTNET_ADDRESSES: ContractAddresses;
export declare const BSC_MAINNET_ADDRESSES: ContractAddresses;
export declare const BSC_TESTNET_ADDRESSES: ContractAddresses;
export declare const N3_MAINNET_ADDRESSES: ContractAddresses;
export declare const N3_TESTNET_ADDRESSES: ContractAddresses;
export declare const BASE_MAINNET_ADDRESSES: ContractAddresses;
export declare const BASE_TESTNET_ADDRESSES: ContractAddresses;
export declare const NEOX_TESTNET_ADDRESSES: ContractAddresses;
export declare const NEOX_MAINNET_ADDRESSES: ContractAddresses;
export declare const SHARDEUM_TESTNET_ADDRESSES: ContractAddresses;
export declare const SHARDEUM_MAINNET_ADDRESSES: ContractAddresses;
export declare const BLAST_TESTNET_ADDRESSES: ContractAddresses;
export declare const BLAST_MAINNET_ADDRESSES: ContractAddresses;
export declare const SOLANA_MAINNET_ADDRESSES: ContractAddresses;
export declare const SOLANA_TESTNET_ADDRESSES: ContractAddresses;
export declare const FLOW_MAINNET_ADDRESSES: ContractAddresses;
export declare const FLOW_TESTNET_ADDRESSES: ContractAddresses;
export declare const PHA_MAINNET_CONTRACTS: {
    EXCHANGE: string;
    INCENTIVES: string;
    GM_TOKEN: string;
    GHOST_PEPE12: string;
};
export declare const PHA_TESTNET_CONTRACTS: {
    EXCHANGE: string;
    INCENTIVES: string;
    GM_TOKEN: string;
    GHOST_PEPE12: string;
};
export declare enum ChainFullName {
    avalanche = "Avalanche",
    avalanchet = "Avalanche Testnet",
    bsc = "BSC",
    bsct = "BSC Testnet",
    eth = "Ethereum",
    etht = "Ethereum Testnet",
    polygon = "Polygon",
    polygont = "Polygon Testnet",
    n3 = "Neo3",
    n3t = "Neo3 Testnet",
    pha = "Phantasma",
    phat = "Phantasma Testnet",
    base = "Base",
    baset = "Base Testnet",
    shardeum = "Shardeum",
    shardeumt = "Shardeum Testnet",
    neox = "NeoX",
    neoxt = "NeoX Testnet",
    blast = "Blast",
    blastt = "Blast Testnet"
}
export declare enum ChainCurrency {
    avalanche = "AVAX",
    avalanchet = "AVAX",
    bsc = "BNB",
    bsct = "BNB",
    eth = "ETH",
    etht = "ETH",
    polygon = "MATIC",
    polygont = "MATIC",
    n3 = "GAS",
    n3t = "GAS",
    pha = "KCAL",
    phat = "KCAL",
    base = "ETH",
    baset = "ETH",
    shardeum = "SHM",
    shardeumt = "SHM",
    neox = "GAS",
    neoxt = "GAS",
    blast = "ETH",
    blastt = "ETH"
}
export declare const AddressesByChain: {
    [name in ChainNetwork]: ContractAddresses | undefined;
};
