export interface IOrderItem {
    baseContract: string;
    baseTokenId?: string;
    baseTokenAmount?: number;
    quoteContract: string;
    quotePrice: string;
    makerAddress: string;
    type: number;
    startDate?: number;
    endDate?: number;
    salt?: string;
    signature?: string;
}
export interface IMintItem {
    creatorAddress: string;
    royalties?: IRoyalties[];
    externalURI: string;
}
export interface IRoyalties {
    address: string;
    value: number;
}
export interface TxObject {
    from: string;
    value?: string;
    gasPrice?: number;
}
export interface IEVMOrder {
    maker: string;
    makeAsset: IEVMAsset;
    taker: string;
    takeAsset: IEVMAsset;
    salt: string | number;
    start: number;
    end: number;
    dataType: string;
    data: string;
}
export interface IEVMAsset {
    assetType: {
        assetClass: string;
        data: string;
    };
    value: string;
}
export interface IEVMAssetType {
    assetClass: string;
    data: string;
}
