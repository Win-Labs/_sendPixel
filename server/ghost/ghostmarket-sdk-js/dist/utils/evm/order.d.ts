import { ChainId } from '@onblockio/gm-api-js';
import { IEVMOrder, IEVMAsset, IEVMAssetType } from '../../core/models/evm';
export declare function enc(token: string, tokenId?: string): string;
export declare function AssetType(assetClass: string, data: string): IEVMAssetType;
export declare function Asset(assetClass: string, assetData: string, value: string): IEVMAsset;
export declare function Order(maker: string, makeAsset: IEVMAsset, taker: string, takeAsset: IEVMAsset, salt: string, start: number, end: number, dataType: string, data: string): IEVMOrder;
export declare function sign(order: IEVMOrder, account: string, verifyingContract: string, provider: any, chainId: ChainId): Promise<any>;
