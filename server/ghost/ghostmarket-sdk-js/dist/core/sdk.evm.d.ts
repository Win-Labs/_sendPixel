import Web3 from 'web3';
import { IEVMOrder, IOrderItem, IMintItem, IRoyalties, TxObject } from '../core/models/evm';
import { GhostMarketApi, // previous PostCreateOrderRequest,
IResult, ChainNetwork } from '@onblockio/gm-api-js/';
export declare class GhostMarketSDK {
    private web3;
    readonly api: GhostMarketApi;
    logger: (arg: string) => void;
    private _chainName;
    private _chainFullName;
    private _chainCurrency;
    private _chainId;
    private _isReadonlyProvider;
    /**
     * Your instance of GhostMarket.
     * Make API calls and GhostMarket Smart Contract method calls.
     * @param  {Web3['currentProvider']} provider To use for creating a Web3 instance. Can be also be `window.ethereum` for browser injected web3 providers.
     * @param  {GhostMarketSDKConfig} options with options for accessing GhostMarket SDK.
     * @param  {(arg:string)=>void} logger? // Optional logger function for logging debug messages.
     */
    constructor(provider: Web3['currentProvider'], options: {
        apiKey?: string;
        environment?: string;
        useReadOnlyProvider?: boolean;
        rpcUrl?: string;
        chainName?: ChainNetwork;
    }, logger?: (arg: string) => void);
    /** Create one or more sell order or nft offer or collection offer
     * @param {IOrderItem[]} items items for the order or offer.
     */
    createOrder(items: IOrderItem[]): Promise<IResult>;
    /** Cancel one or more sell order or nft offer or collection offer
     * @param {IOrderItem[]} items[] items for the order or offer cancel.
     * @param {TxObject} txObject transaction object to send when calling `bulkCancelOrders`.
     */
    bulkCancelOrders(items: IOrderItem[], txObject: TxObject): Promise<any>;
    /** Prepare match of a sell order or a single nft offer or a collection offer
     * @param {IOrderItem} orderMaker order to match.
     * @param {TxObject} txObject transaction object to send when calling `matchOrders`.
     */
    matchOrders(orderMaker: IOrderItem, txObject: TxObject): Promise<any>;
    /** Match orders
     * @param {IEVMOrder} orderLeft order left to match.
     * @param {string} signatureLeft signature left to match.
     * @param {IEVMOrder} orderRight order right to match.
     * @param {string} signatureRight signature right to match.
     * @param {TxObject} txObject transaction object to send when calling `_matchOrders`.
     */
    _matchOrders(orderLeft: IEVMOrder, signatureLeft: string, orderRight: IEVMOrder, signatureRight: string, txObject: TxObject): Promise<any>;
    /** Set royalties for contract
     * @param {string} contractAddress contract address to set royalties for.
     * @param {IRoyalties[]} royalties royalties settings to use for the contract.
     * @param {TxObject} txObject transaction object to send when calling `setRoyaltiesForContract`.
     */
    setRoyaltiesForContract(contractAddress: string, royalties: IRoyalties[], txObject: TxObject): Promise<any>;
    /** Wrap token or unwrap token
     * @param {string} amount value to wrap token from/to.
     * @param {boolean} isFromNativeToWrap true if native to wrap, or false from wrap to native.
     * @param {TxObject} txObject transaction object to send when calling `wrapToken`.
     */
    wrapToken(amount: string, isFromNativeToWrap: boolean, txObject: TxObject): Promise<any>;
    /** Approve NFT Contract
     * @param {string} contractAddress nft contract to approve.
     * @param {TxObject} txObject transaction object to send when calling `approveContract`.
     * @param {string} proxyAddress contract to give approval to.
     */
    approveContract(contractAddress: string, txObject: TxObject, proxyAddress?: string): Promise<any>;
    /** Approve Token Contract
     * @param {string} contractAddress token contract to approve.
     * @param {TxObject} txObject transaction object to send when calling `approveToken`.
     * @param {string} proxyAddress contract to give approval to - optional default to ghostmarket proxy.
     */
    approveToken(contractAddress: string, txObject: TxObject, proxyAddress?: string): Promise<any>;
    /** Check NFT Contract Approval
     * @param {string} contractAddress nft contract to check approval.
     * @param {string} accountAddress address used to check.
     * @param {string} proxyAddress contract which was given approval - optional default to ghostmarket proxy.
     */
    checkContractApproval(contractAddress: string, accountAddress: string, proxyAddress?: string): Promise<any>;
    /** Check ERC20 Token Contract Approval
     * @param {string} contractAddress token contract to check approval.
     * @param {string} accountAddress address used to check.
     * @param {string} proxyAddress contract which was given approval - optional default to ghostmarket proxy.
     */
    checkTokenApproval(contractAddress: string, accountAddress: string, proxyAddress?: string): Promise<any>;
    /** Transfer ERC20
     * @param {string} destinationAddress destination address .
     * @param {string} contractAddress contract of token to transfer.
     * @param {string} amount amount to transfer.
     * @param {TxObject} txObject transaction object to send when calling `transferERC20`.
     */
    transferERC20(destinationAddress: string, contractAddress: string, amount: string, txObject: TxObject): Promise<any>;
    /** Transfer ERC721 NFT
     * @param {string} destinationAddress destination address of NFT.
     * @param {string} contractAddress contract of NFT to transfer.
     * @param {string} tokenId token ID of NFT to transfer.
     * @param {TxObject} txObject transaction object to send when calling `transferERC721`.
     */
    transferERC721(destinationAddress: string, contractAddress: string, tokenId: string, txObject: TxObject): Promise<any>;
    /** Transfer Batch ERC1155 NFT
     * @param {string} destinationAddress destination address of transfer.
     * @param {string} contractAddress contract of NFT to transfer.
     * @param {string[]} tokenIds token ID of NFTs to transfer.
     * @param {string[]} amounts amount of NFTs to transfer.
     * @param {TxObject} txObject transaction object to send when calling `transferERC1155`.
     */
    transferERC1155(destinationAddress: string, contractAddress: string, tokenIds: string[], amounts: number[], txObject: TxObject): Promise<any>;
    /** Burn ERC721 NFT
     * @param {string} contractAddress contract of NFT to transfer.
     * @param {string} tokenId tokenId of NFT to transfer.
     * @param {TxObject} txObject transaction object to send when calling `burnERC721`.
     */
    burnERC721(contractAddress: string, tokenId: string, txObject: TxObject): Promise<any>;
    /** Burn ERC1155 NFT
     * @param {string} contractAddress contract of NFT to transfer.
     * @param {string} tokenId token ID of NFTs to transfer.
     * @param {string} amount amount of NFTs to transfer.
     * @param {TxObject} txObject transaction object to send when calling `burnERC1155`.
     */
    burnERC1155(contractAddress: string, tokenId: string, amount: number, txObject: TxObject): Promise<any>;
    /** Mint ERC721 GHOST NFT
     * @param {IMintItem} item details.
     * @param {TxObject} txObject transaction object to send when calling `mintERC721`.
     */
    mintERC721(item: IMintItem, txObject: TxObject): Promise<any>;
    /** Mint ERC1155 GHOST NFT
     * @param {IMintItem} item details.
     * @param {number} amount amount of NFT to mint.
     * @param {TxObject} txObject transaction object to send when calling `mintERC1155`.
     */
    mintERC1155(item: IMintItem, amount: number, txObject: TxObject): Promise<any>;
    /** Check native balance for address
     * @param {string} accountAddress address used to check.
     */
    checkBalance(accountAddress: string): Promise<any>;
    /** Check one token balance for address
     * @param {string} contractAddress token contract to check approval.
     * @param {string} accountAddress address used to check.
     */
    checkTokenBalance(contractAddress: string, accountAddress: string): Promise<any>;
    /** Check incentives for address
     * @param {string} accountAddress address used to check.
     */
    checkIncentives(accountAddress: string): Promise<any>;
    /** Claim incentives
     * @param {TxObject} txObject transaction object to send when calling `claimIncentives`.
     */
    claimIncentives(txObject: TxObject): Promise<any>;
    /** Check stakes on LP staking contract for address
     * @param {string} accountAddress address used to check.
     */
    checkLPStakes(accountAddress: string): Promise<any>;
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
    /** Sign Data
     * @param {string} dataToSign data to sign.
     * @param {string} accountAddress address used to sign data.
     */
    signData(dataToSign: string, accountAddress: string): Promise<any>;
    /** Get LP token contract address
     * @param {string} chainName chain name to check.
     */
    private _getLPTokenContractAddress;
    /** Get LP staking contract address
     * @param {string} chainName chain name to check.
     */
    private _getLPStakingContractAddress;
    /** Get Incentives contract address
     * @param {string} chainName chain name to check.
     */
    private _getIncentivesContractAddress;
    /** Get ERC721 Ghost contract address
     * @param {string} chainName chain name to check.
     */
    private _getERC721GhostContractAddress;
    /** Get ERC1155 Ghost contract address
     * @param {string} chainName chain name to check.
     */
    private _getERC1155GhostContractAddress;
    /** Get ERC20 Proxy contract address
     * @param {string} chainName chain name to check.
     */
    private _getERC20ProxyContractAddress;
    /** Get NFT Proxy contract address
     * @param {string} chainName chain name to check.
     */
    private _getNFTProxyContractAddress;
    /** Get ExchangeV2 contract address
     * @param {string} chainName chain name to check.
     */
    private _getExchangeV2ProxyContractAddress;
    /** Get Royalties contract address
     * @param {string} chainName chain name to check.
     */
    private _getRoyaltiesRegistryContractAddress;
    /** Get Wrapped Token contract address
     * @param {string} chainName chain name to check.
     */
    private _getWrappedTokenContractAddress;
    /** Get chain support for EIP1559
     * @param {string} chainName chain name to check.
     */
    private _supportsEIP1559;
    /** Get owner of a contract
     * @param {string} contractAddress contract address.
     * @param {boolean} isERC721 true for ERC721, false for ERC1155.
     */
    private _getOwner;
    /** Get owner of an ERC721 NFT
     * @param {string} contractAddress contract address of NFT.
     * @param {string} tokenId tokenId of NFT.
     */
    private _ownerOf;
    /** Get balance of one address for an ERC1155 NFT
     * @param {string} address addres to check.
     * @param {string} contractAddress contract address of NFT.
     * @param {string} tokenId tokenId of NFT.
     */
    private _balanceOf;
    /** Get contract support for ERC721
     * @param {string} contractAddress contract address to check.
     */
    private _supportsERC721;
    /** Get contract support for ERC1155
     * @param {string} contractAddress contract address to check.
     */
    private _supportsERC1155;
    sendMethod(dataOrMethod: any, from: string, _to: string, value: string | undefined): Promise<any>;
    callMethod(dataOrMethod: any, from: string): Promise<any>;
}
