import { IBuyItem, ISellItem, IBidItem, ITransferItem, IBurnItem, IAuctionItem, IOfferItem, IProcessOfferItem, IMintItem, IRoyalties, TxObject } from '../core/models/n3';
import { GhostMarketApi, ChainNetwork } from '@onblockio/gm-api-js';
export declare class GhostMarketN3SDK {
    private provider;
    readonly api: GhostMarketApi;
    logger: (arg: string) => void;
    private _providerRPCUrl;
    private _privateKey;
    private _isMainNet;
    private _chainName;
    private _chainFullName;
    private _contractExchangeAddress;
    private _contractIncentivesAddress;
    private _contractLPStakingAddress;
    private _contractLPTokenAddress;
    private _contractNEP11Address;
    private _contractManagementAddress;
    private _contractDexAddress;
    private _contractFlmAddress;
    /**
     * Your instance of GhostMarket.
     * Make API calls and GhostMarket Smart Contract method calls.
     * @param  {string} provider To use for creating an instance.
     * @param  {GhostMarketSDKConfig} options with options for accessing GhostMarket SDK.
     * @param  {(arg:string)=>void} logger? // Optional logger function for logging debug messages.
     */
    constructor(provider: string, options: {
        apiKey?: string;
        environment?: string;
        privateKey?: string;
        rpcUrl?: string;
        chainName?: ChainNetwork;
    }, logger?: (arg: string) => void);
    /** Buy or cancel one or more NFT(s)
     * @param {IBuyItem[]} items details.
     * @param {string} fromDesiredQuoteHash quote currency hash to use if different from the sale.
     * @param {TxObject} txObject transaction object to send when calling `buyMultiple`.
     */
    buyMultiple(items: IBuyItem[], fromDesiredQuoteHash: string, txObject: TxObject): Promise<any>;
    /** Create one or more sell order(s)
     * @param {ISellItem[]} items details.
     * @param {TxObject} txObject transaction object to send when calling `sellMultiple`.
     */
    sellMultiple(items: ISellItem[], txObject: TxObject): Promise<any>;
    /** Place Bid on NFT Auction
     * @param {IBidItem} item details.
     * @param {string} fromDesiredQuoteHash quote currency hash to use if different from the sale.
     * @param {TxObject} txObject transaction object to send when calling `bidAuction`.
     */
    bidAuction(item: IBidItem, fromDesiredQuoteHash: string, txObject: TxObject): Promise<any>;
    /** Put NFT on Auction
     * @param {IAuctionItem} item details.
     * @param {TxObject} txObject transaction object to send when calling `listAuction`.
     */
    listAuction(item: IAuctionItem, txObject: TxObject): Promise<any>;
    /** Claim ended NFT Auction
     * @param {string} contractAuctionId on chain contract auction ID.
     * @param {TxObject} txObject transaction object to send when calling `claimAuction`.
     */
    claimAuction(contractAuctionId: string, txObject: TxObject): Promise<any>;
    /** Create one or more single nft offer or collection offer
     * @param {IOfferItem[]} items details.
     * @param {TxObject} txObject transaction object to send when calling `placeOffer`.
     */
    placeOffer(items: IOfferItem[], txObject: TxObject): Promise<any>;
    /** Accept or cancel a single nft offer or a collection offer
     * @param {IProcessOfferItem} item details.
     * @param {TxObject} txObject transaction object to send when calling `processOffer`.
     */
    processOffer(item: IProcessOfferItem, txObject: TxObject): Promise<any>;
    /** Edit NFT Listing - fixed price only
     * @param {string} contractAuctionId on chain contract auction ID.
     * @param {string} price new price to use for the listing.
     * @param {TxObject} txObject transaction object to send when calling `editPrice`.
     */
    editPrice(contractAuctionId: string, price: string, txObject: TxObject): Promise<any>;
    /** Set royalties for contract
     * @param {string} contractAddress contract address to set royalties for.
     * @param {IRoyalties[]} royalties royalties settings to use for the contract.
     * @param {TxObject} txObject transaction object to send when calling `setRoyaltiesForContract`.
     */
    setRoyaltiesForContract(contractAddress: string, royalties: IRoyalties[], txObject: TxObject): Promise<any>;
    /** Approve Token Contract
     * @param {string} contractAddress contract to approve.
     * @param {TxObject} txObject transaction object to send when calling `approveToken`.
     */
    approveToken(contractAddress: string, txObject: TxObject): Promise<any>;
    /** Check NEP-17 Token Contract Approval
     * @param {string} contractAddress token contract to check approval.
     * @param {string} address address used to check.
     */
    checkTokenApproval(contractAddress: string, address: string): Promise<any>;
    /** Transfer NEP-17 Token
     * @param {string} destination destination address.
     * @param {string} quoteContract contract of token to transfer.
     * @param {string} amount amount to transfer.
     * @param {TxObject} txObject transaction object to send when calling `transferNEP17`.
     */
    transferNEP17(destination: string, quoteContract: string, amount: string, txObject: TxObject): Promise<any>;
    /** Transfer one or more NEP-11 NFT(s)
     * @param {ITransferItem[]} items details.
     * @param {TxObject} txObject transaction object to send when calling `transferNEP11`.
     */
    transferNEP11(items: ITransferItem[], txObject: TxObject): Promise<any>;
    /** Burn one or more NEP-11 NFT(s)
     * @param {IBurnItem[]} items details.
     * @param {TxObject} txObject transaction object to send when calling `burnNEP11`.
     */
    burnNEP11(items: IBurnItem[], txObject: TxObject): Promise<any>;
    /** Mint one or more NEP-11 NFT(s)
     * @param {IMintItem} item details.
     * @param {TxObject} txObject transaction object to send when calling `mintNEP11`.
     */
    mintNEP11(item: IMintItem, txObject: TxObject): Promise<any>;
    /** Check one token balance for address
     * @param {string} contractAddress token contract to check approval.
     * @param {string} address address used to check.
     */
    checkTokenBalance(contractAddress: string, address: string): Promise<any>;
    /** Check incentives for address
     * @param {string} address address used to check.
     */
    checkIncentives(address: string): Promise<any>;
    /** Claim incentives for address
     * @param {TxObject} txObject transaction object to send when calling `claimIncentives`.
     */
    claimIncentives(txObject: TxObject): Promise<any>;
    /** Check stakes on LP staking contract for address
     * @param {string} accountAddress address used to check.
     */
    checkLPStakes(address: string): Promise<any>;
    /** Check rewards on LP staking contract for address
     * @param {string} accountAddress address used to check.
     */
    checkLPRewards(accountAddress: string): Promise<any>;
    /** Claim LP rewards on LP staking contract for address
     * @param {TxObject} txObject transaction object to send when calling `claimLPRewards`.
     */
    claimLPRewards(txObject: TxObject): Promise<any>;
    /** Stake/Unstake LP tokens on LP staking contract for address
     * @param {string} amount value to stake or unstake.
     * @param {boolean} isStaking true if staking, or false if unstaking.
     * @param {TxObject} txObject transaction object to send when calling `stakeLPTokens`.
     */
    stakeLPTokens(amount: string, isStaking: boolean, txObject: TxObject): Promise<any>;
    /** Swap method to convert from fromDesiredQuoteHash to fromAuctionQuoteHash tokens
     * @param {boolean} fromAuctionQuoteHash quote contract hash of listing.
     * @param {string} fromDesiredQuoteHash quote contract hash desired for payment.
     * @param {boolean} toPrice quote contract price required for payment.
     * @param {TxObject} txObject transaction object to send when calling `swapDexAmountOut`.
     */
    swapDexAmountOut(fromAuctionQuoteHash: string, fromDesiredQuoteHash: string, toPrice: string, txObject: TxObject): Promise<any>;
    /** Helper method returning amountIn for a swap of amountOut using paths
     * @param {string} accountAddress address used to check.
     * @param {string} amountOut amount out expected.
     * @param {IArgs[]} paths paths to use for calculation.
     */
    private getSwapDexAmountsIn;
    /** Helper method returning scopes and invokes to convert from fromDesiredQuoteHash to fromAuctionQuoteHash tokens
     * @param {string} accountAddress address used to check.
     * @param {boolean} fromAuctionQuoteHash true if staking, or false if unstaking.
     * @param {string} fromDesiredQuoteHash value to stake or unstake.
     * @param {boolean} toPrice true if staking, or false if unstaking.
     * @param {TxObject} txObject transaction object to send when calling `stakeLPTokens`.
     */
    private addCallSwapDexAmountOut;
    /** Sign Data
     * @param {string} dataToSign data to sign.
     */
    signData(dataToSign: string): Promise<any>;
    /** Get FLM contract address
     * @param {string} chainName chain name to check.
     */
    private _getFlmContractAddress;
    /** Get Dex contract address
     * @param {string} chainName chain name to check.
     */
    private _getDexContractAddress;
    /** Get Incentives contract address
     * @param {string} chainName chain name to check.
     */
    private _getIncentivesContractAddress;
    /** Get LP Staking contract address
     * @param {string} chainName chain name to check.
     */
    private _getLPStakingContractAddress;
    /** Get LP Token contract address
     * @param {string} chainName chain name to check.
     */
    private _getLPTokenContractAddress;
    /** Get NEP-11 Ghost contract address
     * @param {string} chainName chain name to check.
     */
    private _getNEP11GhostContractAddress;
    /** Get Exchange contract address
     * @param {string} chainName chain name to check.
     */
    private _getExchangeContractAddress;
    /** Get Management contract address
     * @param {string} chainName chain name to check.
     */
    private _getManagementContractAddress;
    /** Get owner of a contract
     * @param {string} contractAddress contract address.
     */
    /** Get owner of an NEP-11 NFT
     * @param {string} contractAddress contract address of NFT.
     * @param {string} address address used to check.
     * @param {string} tokenId tokenId of NFT.
     */
    private _ownerOf;
    /** Get contract support for one particular standard
     * @param {string} contractAddress contract address to check.
     * @param {string} address address used to check.
     * @param {string} standard standard to check.
     */
    private _supportsStandard;
    /** Get Provider
     */
    getProvider(): any;
    invoke(invokeParams: any): Promise<string>;
    invokeMultiple(invokeParams: any): Promise<string>;
    invokeRead(invokeParams: any): Promise<any>;
    invokeReadMultiple(invokeParams: any): Promise<any>;
}
