export interface IBuyItem {
    contractAuctionId: string;
    price: string;
    quoteContract: string;
    isCancellation?: boolean;
}
export interface ISellItem {
    tokenId: string;
    baseContract: string;
    price: string;
    quoteContract: string;
    startDate?: number;
    endDate?: number;
}
export interface IBidItem {
    contractAuctionId: string;
    bidPrice?: string;
    quoteContract: string;
}
export interface ITransferItem {
    baseContract: string;
    destination: string;
    tokenId: string;
}
export interface IBurnItem {
    contractAddress: string;
    tokenId: string;
}
export interface IAuctionItem {
    auctionType: number;
    tokenId: string;
    baseContract: string;
    extensionPeriod: number;
    startDate?: number;
    endDate?: number;
    startPrice: string;
    endPrice: string;
    quoteContract: string;
}
export interface IOfferItem {
    baseContract: string;
    quoteContract: string;
    tokenId?: string;
    price: string;
    startDate?: number;
    endDate?: number;
}
export interface IProcessOfferItem {
    contractAuctionId: string;
    quoteContract: string;
    tokenId?: string;
    isCancellation?: boolean;
}
export interface IMintItem {
    quantity?: number;
    attrT1?: string;
    attrV1?: string;
    attrT2?: string;
    attrV2?: string;
    attrT3?: string;
    attrV3?: string;
    name: string;
    description: string;
    imageURL: string;
    externalURI?: string;
    royalties?: IRoyalties[];
    type?: string;
}
export interface IRoyalties {
    address: string;
    value: number;
}
export interface IArgs {
    type: string;
    value: string | any;
}
export interface TxObject {
    from: string;
    networkFee?: string;
    systemFee?: string;
}
export declare enum Method {
    BID_TOKEN = "bidToken",
    CANCEL_SALE = "cancelSale",
    LIST_TOKEN = "listToken",
    EDIT_SALE = "editSale",
    TRANSFER = "transfer",
    BURN = "burn",
    MINT = "mint",
    MULTI_MINT = "multiMint",
    SET_ROYALTIES_FOR_CONTRACT = "setRoyaltiesForContract",
    CLAIM = "claim",
    GET_INCENTIVE = "getIncentive",
    BALANCE_OF = "balanceOf",
    APPROVE = "approve",
    ALLOWANCE = "allowance",
    PLACE_OFFER = "placeOffer",
    ACCEPT_OFFER = "acceptOffer",
    CANCEL_OFFER = "cancelOffer",
    GET_CONTRACT = "getContract",
    OWNER_OF = "ownerOf",
    READ_LP_STAKES = "getStakingAmount",
    READ_LP_REWARDS = "checkFLM",
    CLAIM_LP_INCENTIVES = "claimFLM",
    STAKE_LP = "transfer",
    UNSTAKE_LP = "refund",
    SWAP_TOKEN_OUT_FOR_TOKEN_IN = "swapTokenOutForTokenIn",
    GET_AMOUNTS_IN = "getAmoutsIn"
}
export declare enum Standard {
    NEP_11 = "NEP-11",
    NEP_17 = "NEP-17",
    NEP_17_1 = "NEP-17-1"
}
