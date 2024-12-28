"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GhostMarketN3SDK = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
const helpers_1 = require("../utils/n3/helpers");
const neon_js_1 = require("@cityofzion/neon-js");
const bignumber_1 = require("@ethersproject/bignumber");
const N3PrivateProvider_1 = require("../utils/n3/N3PrivateProvider");
const constants_1 = require("./constants");
const n3_1 = require("./constants/n3");
const n3_2 = require("../core/models/n3");
const gm_api_js_1 = require("@onblockio/gm-api-js");
class GhostMarketN3SDK {
    /**
     * Your instance of GhostMarket.
     * Make API calls and GhostMarket Smart Contract method calls.
     * @param  {string} provider To use for creating an instance.
     * @param  {GhostMarketSDKConfig} options with options for accessing GhostMarket SDK.
     * @param  {(arg:string)=>void} logger? // Optional logger function for logging debug messages.
     */
    constructor(provider, options, logger) {
        options.apiKey = options.apiKey || '';
        options.environment = options.environment || constants_1.MAINNET_API_URL;
        this._isMainNet = options.chainName === gm_api_js_1.ChainNetwork.N3;
        options.privateKey = options.privateKey || '';
        options.rpcUrl = options.rpcUrl || '';
        this._providerRPCUrl = options.rpcUrl;
        options.chainName = options.chainName || gm_api_js_1.ChainNetwork.N3;
        this._chainName = options.chainName;
        this._chainFullName = constants_1.ChainFullName[this._chainName];
        this._contractExchangeAddress = this._getExchangeContractAddress(this._chainName);
        this._contractIncentivesAddress = this._getIncentivesContractAddress(this._chainName);
        this._contractLPStakingAddress = this._getLPStakingContractAddress(this._chainName);
        this._contractLPTokenAddress = this._getLPTokenContractAddress(this._chainName);
        this._contractNEP11Address = this._getNEP11GhostContractAddress(this._chainName);
        this._contractManagementAddress = this._getManagementContractAddress(this._chainName);
        this._contractDexAddress = this._getDexContractAddress(this._chainName);
        this._contractFlmAddress = this._getFlmContractAddress(this._chainName);
        this._privateKey = options.privateKey;
        this.provider = provider || 'private';
        const apiConfig = {
            apiKey: options.apiKey,
            baseUrl: options.environment,
        };
        this.api = new gm_api_js_1.GhostMarketApi(apiConfig);
        // Logger: Default to nothing.
        this.logger = logger || ((arg) => arg);
        if (provider === 'private' && !options.privateKey) {
            throw new Error('Please set a private key!');
        }
    }
    /** Buy or cancel one or more NFT(s)
     * @param {IBuyItem[]} items details.
     * @param {string} fromDesiredQuoteHash quote currency hash to use if different from the sale.
     * @param {TxObject} txObject transaction object to send when calling `buyMultiple`.
     */
    buyMultiple(items, fromDesiredQuoteHash, txObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const allowedContracts = [this._contractExchangeAddress];
            const argsBuyMultiple = [];
            // auto convert if fromDesiredQuoteHash is passed
            if (fromDesiredQuoteHash) {
                const priceNFTFormatted = items[0].price;
                const feeMultiplier = constants_1.GHOSTMARKET_TRADE_FEE_BPS;
                const feeAmount = bignumber_1.BigNumber.from(priceNFTFormatted)
                    .mul(bignumber_1.BigNumber.from(feeMultiplier))
                    .div(10000)
                    .toNumber();
                const toPrice = feeAmount
                    ? bignumber_1.BigNumber.from(priceNFTFormatted).add(feeAmount)
                    : priceNFTFormatted;
                const dexCallResults = yield this.addCallSwapDexAmountOut(txObject.from, items[0].quoteContract, fromDesiredQuoteHash, toPrice.toString());
                for (let i = 0; i < dexCallResults.scopes.length; i++) {
                    if (!allowedContracts.includes(dexCallResults.scopes[i])) {
                        allowedContracts.push(dexCallResults.scopes[i]);
                    }
                    argsBuyMultiple.push(dexCallResults.invokes);
                }
            }
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                console.log(`buyMultiple: ${item.isCancellation ? 'cancelling' : 'buying'} nft on ${this._chainFullName}`);
                const priceNFTFormatted = item.price;
                if (item.isCancellation) {
                    argsBuyMultiple.push({
                        scriptHash: this._contractExchangeAddress,
                        operation: n3_2.Method.CANCEL_SALE,
                        args: [
                            {
                                type: 'ByteArray',
                                value: (0, helpers_1.numberToByteString)(item.contractAuctionId.toString()),
                            },
                        ],
                    });
                }
                else {
                    const quoteContract = item.quoteContract;
                    if (!allowedContracts.includes(quoteContract)) {
                        allowedContracts.push(quoteContract);
                    }
                    const balance = yield this.checkTokenBalance(item.quoteContract, txObject.from);
                    const amountDiff = bignumber_1.BigNumber.from(priceNFTFormatted);
                    const balanceDiff = bignumber_1.BigNumber.from(balance.toString());
                    const diff = amountDiff.sub(balanceDiff);
                    if (diff.gt(bignumber_1.BigNumber.from(0))) {
                        throw new Error(`Not enough balance to buy NFT, missing: ${diff}`);
                    }
                    argsBuyMultiple.push({
                        scriptHash: this._contractExchangeAddress,
                        operation: n3_2.Method.BID_TOKEN,
                        args: [
                            {
                                type: 'Hash160',
                                value: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                            },
                            {
                                type: 'ByteArray',
                                value: (0, helpers_1.numberToByteString)(item.contractAuctionId.toString()),
                            },
                            {
                                type: 'Integer',
                                value: priceNFTFormatted,
                            },
                        ],
                    });
                }
            }
            const signers = [
                {
                    account: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                    scopes: this.provider === 'private' ? 128 : 16,
                    allowedContracts,
                },
            ];
            const invokeParamsMultiple = {
                invokeArgs: argsBuyMultiple,
                signers,
                networkFee: txObject.networkFee,
                systemFee: txObject.systemFee,
            };
            try {
                return this.invokeMultiple(invokeParamsMultiple);
            }
            catch (e) {
                throw new Error(`buyMultiple: failed to execute ${items[0].isCancellation ? n3_2.Method.CANCEL_SALE : n3_2.Method.BID_TOKEN} on ${this._contractExchangeAddress} with error: ${e}`);
            }
        });
    }
    /** Create one or more sell order(s)
     * @param {ISellItem[]} items details.
     * @param {TxObject} txObject transaction object to send when calling `sellMultiple`.
     */
    sellMultiple(items, txObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const isListBatch = items.length > 1;
            console.log(`sellMultiple: selling ${isListBatch ? 'bulk' : 'single'} nft on ${this._chainFullName}`);
            const allowedContracts = [this._contractExchangeAddress];
            const argsListTokenMultiple = [];
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const supportsNEP11 = yield this._supportsStandard(item.baseContract, txObject.from, n3_2.Standard.NEP_11);
                if (!supportsNEP11)
                    throw new Error(`contract: ${item.baseContract} does not support NEP-11`);
                const supportsNEP17 = yield this._supportsStandard(item.quoteContract, txObject.from, n3_2.Standard.NEP_17);
                if (!supportsNEP17)
                    throw new Error(`contract: ${item.quoteContract} does not support NEP-17`);
                const owner = yield this._ownerOf(item.baseContract, txObject.from, item.tokenId);
                if (owner.toLowerCase() !== txObject.from.toLowerCase())
                    throw new Error(`owner: ${owner} does not match tx.sender: ${txObject.from}`);
                const currentDateFormatted = item.startDate === null || !item.startDate
                    ? new Date().getTime()
                    : new Date(item.startDate).getTime();
                const endDateFormatted = item.endDate === null || !item.endDate ? 0 : new Date(item.endDate).getTime();
                const maxAllowedDate = new Date().getTime() + 2592000000 * 6; // MSECONDS_PER_180_DAYS
                if (endDateFormatted > maxAllowedDate) {
                    throw new Error(`Listings must have an end date, with a maximum of 180 days from now`);
                }
                const baseContract = item.baseContract;
                if (!allowedContracts.includes(baseContract)) {
                    allowedContracts.push(baseContract);
                }
                argsListTokenMultiple.push({
                    scriptHash: this._contractExchangeAddress,
                    operation: n3_2.Method.LIST_TOKEN,
                    args: [
                        {
                            type: 'Hash160',
                            value: item.baseContract,
                        },
                        {
                            type: 'Hash160',
                            value: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                        },
                        {
                            type: 'Hash160',
                            value: item.quoteContract,
                        },
                        {
                            type: 'ByteArray',
                            value: item.tokenId,
                        },
                        {
                            type: 'Integer',
                            value: item.price,
                        },
                        {
                            type: 'Integer',
                            value: 0,
                        },
                        {
                            type: 'Integer',
                            value: currentDateFormatted,
                        },
                        {
                            type: 'Integer',
                            value: endDateFormatted,
                        },
                        {
                            type: 'Integer',
                            value: 0,
                        },
                        {
                            type: 'Integer',
                            value: 0, // auction type fixed listing
                        },
                    ],
                });
            }
            const signers = [
                {
                    account: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                    scopes: this.provider === 'private' ? 128 : 16,
                    allowedContracts,
                },
            ];
            const invokeParamsMultiple = {
                invokeArgs: argsListTokenMultiple,
                signers,
                networkFee: txObject.networkFee,
                systemFee: txObject.systemFee,
            };
            try {
                return this.invokeMultiple(invokeParamsMultiple);
            }
            catch (e) {
                throw new Error(`sellMultiple: failed to execute ${n3_2.Method.LIST_TOKEN} on ${this._contractExchangeAddress} with error: ${e}`);
            }
        });
    }
    /** Place Bid on NFT Auction
     * @param {IBidItem} item details.
     * @param {string} fromDesiredQuoteHash quote currency hash to use if different from the sale.
     * @param {TxObject} txObject transaction object to send when calling `bidAuction`.
     */
    bidAuction(item, fromDesiredQuoteHash, txObject) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`bidAuction: bidding on nft on ${this._chainFullName}`);
            const currentBidFormatted = item.bidPrice || 0;
            const argsBidToken = [];
            const allowedContracts = [this._contractExchangeAddress, item.quoteContract];
            // auto convert if fromDesiredQuoteHash is passed
            if (fromDesiredQuoteHash) {
                const priceNFTFormatted = item.bidPrice;
                const feeMultiplier = constants_1.GHOSTMARKET_TRADE_FEE_BPS;
                const feeAmount = bignumber_1.BigNumber.from(priceNFTFormatted)
                    .mul(bignumber_1.BigNumber.from(feeMultiplier))
                    .div(10000)
                    .toNumber();
                const toPrice = feeAmount
                    ? bignumber_1.BigNumber.from(priceNFTFormatted).add(feeAmount)
                    : priceNFTFormatted;
                const dexCallResults = yield this.addCallSwapDexAmountOut(txObject.from, item.quoteContract, fromDesiredQuoteHash, toPrice.toString());
                for (let i = 0; i < dexCallResults.scopes.length; i++) {
                    if (!allowedContracts.includes(dexCallResults.scopes[i])) {
                        allowedContracts.push(dexCallResults.scopes[i]);
                    }
                    argsBidToken.push(dexCallResults.invokes);
                }
            }
            const balance = yield this.checkTokenBalance(item.quoteContract, txObject.from);
            const amountDiff = bignumber_1.BigNumber.from(currentBidFormatted.toString());
            const balanceDiff = bignumber_1.BigNumber.from(balance.toString());
            const diff = amountDiff.sub(balanceDiff);
            if (diff.gt(bignumber_1.BigNumber.from(0)) && !fromDesiredQuoteHash) {
                // only checked if fromDesiredQuoteHash not passed
                throw new Error(`Not enough balance to bid on NFT, missing: ${diff}`);
            }
            argsBidToken.push({
                scriptHash: this._contractExchangeAddress,
                operation: n3_2.Method.BID_TOKEN,
                args: [
                    {
                        type: 'Hash160',
                        value: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                    },
                    {
                        type: 'ByteArray',
                        value: (0, helpers_1.numberToByteString)(item.contractAuctionId.toString()),
                    },
                    {
                        type: 'Integer',
                        value: currentBidFormatted,
                    },
                ],
            });
            const signers = [
                {
                    account: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                    scopes: this.provider === 'private' ? 128 : 16,
                    allowedContracts,
                },
            ];
            const invokeParamsMultiple = {
                invokeArgs: argsBidToken,
                signers,
                networkFee: txObject.networkFee,
                systemFee: txObject.systemFee,
            };
            try {
                return this.invokeMultiple(invokeParamsMultiple);
            }
            catch (e) {
                throw new Error(`bidAuction: failed to execute ${n3_2.Method.BID_TOKEN} on ${this._contractExchangeAddress} with error: ${e}`);
            }
        });
    }
    /** Put NFT on Auction
     * @param {IAuctionItem} item details.
     * @param {TxObject} txObject transaction object to send when calling `listAuction`.
     */
    listAuction(item, txObject) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`listAuction: auction nft on ${this._chainFullName}`);
            const supportsNEP11 = yield this._supportsStandard(item.baseContract, txObject.from, n3_2.Standard.NEP_11);
            if (!supportsNEP11)
                throw new Error(`contract: ${item.baseContract} does not support NEP-11`);
            const supportsNEP17 = yield this._supportsStandard(item.quoteContract, txObject.from, n3_2.Standard.NEP_17);
            if (!supportsNEP17)
                throw new Error(`contract: ${item.quoteContract} does not support NEP-17`);
            let extensionPeriod = item.extensionPeriod ? item.extensionPeriod : 0; // min 0 - max 1h (3600)
            switch (item.auctionType) {
                case 1: // classic
                    break;
                case 2: // reserve
                    break;
                case 3: // dutch
                    extensionPeriod = 0;
                    break;
                case 0: // fixed
                    extensionPeriod = 0;
                    break;
            }
            const priceNFTFormatted = (_a = item.startPrice) !== null && _a !== void 0 ? _a : 0;
            const endPriceNFTFormatted = (_b = item.endPrice) !== null && _b !== void 0 ? _b : 0;
            const currentDateFormatted = item.startDate === null || !item.startDate
                ? new Date().getTime()
                : new Date(item.startDate).getTime();
            const endDateFormatted = item.endDate === null || !item.endDate ? 0 : new Date(item.endDate).getTime();
            const maxAllowedDate = new Date().getTime() + 2592000000 * 6; // MSECONDS_PER_180_DAYS
            if (item.auctionType !== 2 && endDateFormatted > maxAllowedDate) {
                throw new Error(`Auctions must have an end date, with a maximum of 180 days from now`);
            }
            const argsListToken = [
                {
                    type: 'Hash160',
                    value: item.baseContract,
                },
                {
                    type: 'Hash160',
                    value: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                },
                {
                    type: 'Hash160',
                    value: item.quoteContract,
                },
                {
                    type: 'ByteArray',
                    value: item.tokenId,
                },
                {
                    type: 'Integer',
                    value: priceNFTFormatted,
                },
                {
                    type: 'Integer',
                    value: endPriceNFTFormatted,
                },
                {
                    type: 'Integer',
                    value: currentDateFormatted,
                },
                {
                    type: 'Integer',
                    value: endDateFormatted,
                },
                {
                    type: 'Integer',
                    value: extensionPeriod,
                },
                {
                    type: 'Integer',
                    value: item.auctionType,
                },
            ];
            const allowedContracts = [this._contractExchangeAddress];
            const baseContract = item.baseContract;
            if (!allowedContracts.includes(baseContract)) {
                allowedContracts.push(baseContract);
            }
            const signers = [
                {
                    account: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                    scopes: this.provider === 'private' ? 128 : 16,
                    allowedContracts,
                },
            ];
            const invokeParams = {
                scriptHash: this._contractExchangeAddress,
                operation: n3_2.Method.LIST_TOKEN,
                args: argsListToken,
                signers,
                networkFee: txObject.networkFee,
                systemFee: txObject.systemFee,
            };
            try {
                return this.invoke(invokeParams);
            }
            catch (e) {
                throw new Error(`listAuction: failed to execute ${n3_2.Method.LIST_TOKEN} on ${this._contractExchangeAddress} with error: ${e}`);
            }
        });
    }
    /** Claim ended NFT Auction
     * @param {string} contractAuctionId on chain contract auction ID.
     * @param {TxObject} txObject transaction object to send when calling `claimAuction`.
     */
    claimAuction(contractAuctionId, txObject) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`claimAuction: claiming nft auction on ${this._chainFullName}`);
            const argsBidToken = [
                {
                    type: 'Hash160',
                    value: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                },
                {
                    type: 'ByteArray',
                    value: (0, helpers_1.numberToByteString)(contractAuctionId),
                },
                {
                    type: 'Integer',
                    value: 0,
                },
            ];
            const signers = [
                {
                    account: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                    scopes: 1,
                },
            ];
            const invokeParams = {
                scriptHash: this._contractExchangeAddress,
                operation: n3_2.Method.BID_TOKEN,
                args: argsBidToken,
                signers,
                networkFee: txObject.networkFee,
                systemFee: txObject.systemFee,
            };
            try {
                return this.invoke(invokeParams);
            }
            catch (e) {
                throw new Error(`claimAuction: failed to execute ${n3_2.Method.BID_TOKEN} on ${this._contractExchangeAddress} with error: ${e}`);
            }
        });
    }
    /** Create one or more single nft offer or collection offer
     * @param {IOfferItem[]} items details.
     * @param {TxObject} txObject transaction object to send when calling `placeOffer`.
     */
    placeOffer(items, txObject) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                console.log(`placeOffer: placing ${item.tokenId ? '' : 'collection '}offer on nft on ${this._chainFullName}`);
                const supportsNEP11 = yield this._supportsStandard(item.baseContract, txObject.from, n3_2.Standard.NEP_11);
                if (!supportsNEP11)
                    throw new Error(`contract: ${item.baseContract} does not support NEP-11`);
                const supportsNEP17 = yield this._supportsStandard(item.quoteContract, txObject.from, n3_2.Standard.NEP_17);
                if (!supportsNEP17)
                    throw new Error(`contract: ${item.quoteContract} does not support NEP-17`);
                const supportsNEP17Extension = yield this._supportsStandard(item.quoteContract, txObject.from, n3_2.Standard.NEP_17_1);
                if (!supportsNEP17Extension)
                    throw new Error(`contract: ${item.quoteContract} does not support NEP-17 Extension`);
                const balance = yield this.checkTokenBalance(item.quoteContract, txObject.from);
                const amountDiff = bignumber_1.BigNumber.from(item.price);
                const balanceDiff = bignumber_1.BigNumber.from(balance.toString());
                const diff = amountDiff.sub(balanceDiff);
                if (diff.gt(bignumber_1.BigNumber.from(0))) {
                    throw new Error(`Not enough balance to place offer on NFT, missing: ${diff}`);
                }
                const amountApproved = yield this.checkTokenApproval(items[i].quoteContract, txObject.from);
                const hasApprovedEnough = bignumber_1.BigNumber.from(amountApproved) > bignumber_1.BigNumber.from(items[i].price);
                if (!hasApprovedEnough)
                    throw new Error(`contract: ${items[i].quoteContract} spender allowance exceeded for: ${txObject.from}`);
                const currentDateFormatted = item.startDate === null || !item.startDate
                    ? new Date().getTime()
                    : new Date(item.startDate).getTime();
                const endDateFormatted = item.endDate === null || !item.endDate ? 0 : new Date(item.endDate).getTime();
                const maxAllowedDate = new Date().getTime() + 2592000000 * 6; // MSECONDS_PER_180_DAYS
                if (endDateFormatted > maxAllowedDate) {
                    throw new Error(`Offers must have an end date, with a maximum of 180 days from now`);
                }
                const argsPlaceOffer = [
                    {
                        type: 'Hash160',
                        value: item.baseContract,
                    },
                    {
                        type: 'Hash160',
                        value: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                    },
                    {
                        type: 'Hash160',
                        value: item.quoteContract,
                    },
                    {
                        type: 'ByteArray',
                        value: item.tokenId ? item.tokenId : '', // set to null for collection offer
                    },
                    {
                        type: 'Integer',
                        value: item.price,
                    },
                    {
                        type: 'Integer',
                        value: currentDateFormatted,
                    },
                    {
                        type: 'Integer',
                        value: endDateFormatted,
                    },
                ];
                const signers = [
                    {
                        account: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                        scopes: 1,
                    },
                ];
                const invokeParams = {
                    scriptHash: this._contractExchangeAddress,
                    operation: n3_2.Method.PLACE_OFFER,
                    args: argsPlaceOffer,
                    signers,
                    networkFee: txObject.networkFee,
                    systemFee: txObject.systemFee,
                };
                try {
                    return this.invoke(invokeParams);
                }
                catch (e) {
                    throw new Error(`placeOffer: failed to execute ${n3_2.Method.PLACE_OFFER} on ${this._contractExchangeAddress} with error: ${e}`);
                }
            }
        });
    }
    /** Accept or cancel a single nft offer or a collection offer
     * @param {IProcessOfferItem} item details.
     * @param {TxObject} txObject transaction object to send when calling `processOffer`.
     */
    processOffer(item, txObject) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`processOffer: ${item.isCancellation ? 'cancel offer' : 'accept offer'} on nft on ${this._chainFullName}`);
            const argsAcceptOffer = [
                {
                    type: 'Hash160',
                    value: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                },
                {
                    type: 'ByteArray',
                    value: (0, helpers_1.numberToByteString)(item.contractAuctionId),
                },
                {
                    type: 'ByteArray',
                    value: item.tokenId ? item.tokenId : '',
                },
            ];
            const argsCancelOffer = [
                {
                    type: 'ByteArray',
                    value: (0, helpers_1.numberToByteString)(item.contractAuctionId),
                },
            ];
            const allowedContracts = [this._contractExchangeAddress, item.quoteContract];
            const signers = item.isCancellation
                ? [
                    {
                        account: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                        scopes: 1,
                    },
                ]
                : [
                    {
                        account: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                        scopes: this.provider === 'private' ? 128 : 16,
                        allowedContracts,
                    },
                ];
            const invokeParams = {
                scriptHash: this._contractExchangeAddress,
                operation: item.isCancellation ? n3_2.Method.CANCEL_OFFER : n3_2.Method.ACCEPT_OFFER,
                args: item.isCancellation ? argsCancelOffer : argsAcceptOffer,
                signers,
                networkFee: txObject.networkFee,
                systemFee: txObject.systemFee,
            };
            try {
                return this.invoke(invokeParams);
            }
            catch (e) {
                throw new Error(`processOffer: failed to execute ${item.isCancellation ? n3_2.Method.CANCEL_OFFER : n3_2.Method.ACCEPT_OFFER} on ${this._contractExchangeAddress} with error: ${e}`);
            }
        });
    }
    /** Edit NFT Listing - fixed price only
     * @param {string} contractAuctionId on chain contract auction ID.
     * @param {string} price new price to use for the listing.
     * @param {TxObject} txObject transaction object to send when calling `editPrice`.
     */
    editPrice(contractAuctionId, price, txObject) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`editPrice: edit auction ${contractAuctionId} listing price on ${this._chainFullName}`);
            const argsEditSale = [
                {
                    type: 'Hash160',
                    value: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                },
                {
                    type: 'ByteArray',
                    value: (0, helpers_1.numberToByteString)(contractAuctionId.toString()),
                },
                {
                    type: 'Integer',
                    value: price,
                },
                {
                    type: 'Integer',
                    value: 0,
                },
                {
                    type: 'Integer',
                    value: 0, // set to 0 - re use current one
                },
                {
                    type: 'Integer',
                    value: 0, // set to 0 - re use current one
                },
                {
                    type: 'Integer',
                    value: 0,
                },
            ];
            const signers = [
                {
                    account: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                    scopes: 1,
                },
            ];
            const invokeParams = {
                scriptHash: this._contractExchangeAddress,
                operation: n3_2.Method.EDIT_SALE,
                args: argsEditSale,
                signers,
                networkFee: txObject.networkFee,
                systemFee: txObject.systemFee,
            };
            try {
                return this.invoke(invokeParams);
            }
            catch (e) {
                throw new Error(`editPrice: failed to execute ${n3_2.Method.EDIT_SALE} on ${this._contractExchangeAddress} with error: ${e}`);
            }
        });
    }
    /** Set royalties for contract
     * @param {string} contractAddress contract address to set royalties for.
     * @param {IRoyalties[]} royalties royalties settings to use for the contract.
     * @param {TxObject} txObject transaction object to send when calling `setRoyaltiesForContract`.
     */
    setRoyaltiesForContract(contractAddress, royalties, txObject) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`setRoyaltiesForContract: edit collection royalties on ${this._chainFullName}`);
            if (this.provider === 'private')
                throw new Error('Only supported on Neoline / O3 for now.');
            const supportsNEP11 = yield this._supportsStandard(contractAddress, txObject.from, n3_2.Standard.NEP_11);
            if (!supportsNEP11)
                throw new Error(`contract: ${contractAddress} does not support NEP-11`);
            /* const owner = await this._getOwner(contractAddress)
    
            if (owner.toLowerCase() !== txObject.from.toLowerCase())
                throw new Error(`owner: ${owner} does not match tx.sender: ${txObject.from}`) */
            // force empty if no royalties
            let argsSetCollectionRoyalties = [
                {
                    type: 'Hash160',
                    value: contractAddress,
                },
                {
                    type: 'Array',
                    value: [],
                },
            ];
            // otherwise add all royalties
            if (royalties.length > 0) {
                const royaltyArray = [];
                for (let i = 0; i < royalties.length; i++) {
                    royaltyArray.push({
                        type: 'Hash160',
                        value: (0, helpers_1.getScriptHashFromAddress)(royalties[i].address),
                    }, {
                        type: 'Integer',
                        value: royalties[i].value,
                    });
                }
                argsSetCollectionRoyalties = [
                    {
                        type: 'Hash160',
                        value: contractAddress,
                    },
                    {
                        type: 'Array',
                        value: [
                            {
                                type: 'Array',
                                value: royaltyArray,
                            },
                        ],
                    },
                ];
            }
            const allowedContracts = [contractAddress, this._contractExchangeAddress];
            const signers = [
                {
                    account: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                    scopes: this.provider === 'private' ? 128 : 16,
                    allowedContracts,
                },
                {
                    account: contractAddress,
                    scopes: this.provider === 'private' ? 128 : 16,
                    allowedContracts,
                },
            ];
            const invokeParams = {
                scriptHash: this._contractExchangeAddress,
                operation: n3_2.Method.SET_ROYALTIES_FOR_CONTRACT,
                args: argsSetCollectionRoyalties,
                signers,
                networkFee: txObject.networkFee,
                systemFee: txObject.systemFee,
            };
            try {
                return this.invoke(invokeParams);
            }
            catch (e) {
                throw new Error(`setRoyaltiesForContract: Failed to execute ${n3_2.Method.SET_ROYALTIES_FOR_CONTRACT} on ${this._contractExchangeAddress} with error: ${e}`);
            }
        });
    }
    /** Approve Token Contract
     * @param {string} contractAddress contract to approve.
     * @param {TxObject} txObject transaction object to send when calling `approveToken`.
     */
    approveToken(contractAddress, txObject) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`approveToken: approve ${contractAddress} for ${txObject.from} on ${this._chainFullName}`);
            const supportsNEP17 = yield this._supportsStandard(contractAddress, txObject.from, n3_2.Standard.NEP_17);
            if (!supportsNEP17)
                throw new Error(`contract: ${contractAddress} does not support NEP-17`);
            const supportsNEP17Extension = yield this._supportsStandard(contractAddress, txObject.from, n3_2.Standard.NEP_17_1);
            if (!supportsNEP17Extension)
                throw new Error(`contract: ${contractAddress} does not support NEP-17 Extension`);
            const argsApproveToken = [
                {
                    type: 'Hash160',
                    value: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                },
                {
                    type: 'Hash160',
                    value: this._contractExchangeAddress,
                },
                {
                    type: 'Integer',
                    value: n3_1.MAX_INT_255,
                },
            ];
            const signers = [
                {
                    account: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                    scopes: 1,
                },
            ];
            const invokeParams = {
                scriptHash: contractAddress,
                operation: n3_2.Method.APPROVE,
                args: argsApproveToken,
                signers,
                networkFee: txObject.networkFee,
                systemFee: txObject.systemFee,
            };
            try {
                return this.invoke(invokeParams);
            }
            catch (e) {
                throw new Error(`approveToken: failed to execute ${n3_2.Method.APPROVE} on ${contractAddress} with error: ${e}`);
            }
        });
    }
    /** Check NEP-17 Token Contract Approval
     * @param {string} contractAddress token contract to check approval.
     * @param {string} address address used to check.
     */
    checkTokenApproval(contractAddress, address) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`checkTokenApproval: reading ${contractAddress} approval for ${address} on N3 ${this._chainFullName}`);
            const argsCheckAllowance = [
                {
                    type: 'Hash160',
                    value: (0, helpers_1.getScriptHashFromAddress)(address),
                },
                {
                    type: 'Hash160',
                    value: this._contractExchangeAddress,
                },
            ];
            const signers = [
                {
                    account: (0, helpers_1.getScriptHashFromAddress)(address),
                    scopes: 1,
                },
            ];
            const invokeParams = {
                scriptHash: contractAddress,
                operation: n3_2.Method.ALLOWANCE,
                args: argsCheckAllowance,
                signers,
            };
            try {
                const response = yield this.invokeRead(invokeParams);
                if (response.exception)
                    return `checkTokenApproval exception: ${response.exception}`;
                return response.stack && response.stack[0] && response.stack[0].value;
            }
            catch (e) {
                throw new Error(`checkTokenApproval: failed to execute ${n3_2.Method.ALLOWANCE} on ${contractAddress} with error: ${e}`);
            }
        });
    }
    /** Transfer NEP-17 Token
     * @param {string} destination destination address.
     * @param {string} quoteContract contract of token to transfer.
     * @param {string} amount amount to transfer.
     * @param {TxObject} txObject transaction object to send when calling `transferNEP17`.
     */
    transferNEP17(destination, quoteContract, amount, txObject) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`transferNEP17: transfer token on ${this._chainFullName}`);
            const supportsNEP17 = yield this._supportsStandard(quoteContract, txObject.from, n3_2.Standard.NEP_17);
            if (!supportsNEP17)
                throw new Error(`contract: ${quoteContract} does not support NEP-17`);
            const balance = yield this.checkTokenBalance(quoteContract, txObject.from);
            const amountDiff = bignumber_1.BigNumber.from(amount);
            const balanceDiff = bignumber_1.BigNumber.from(balance.toString());
            const diff = amountDiff.sub(balanceDiff);
            if (diff.gt(bignumber_1.BigNumber.from(0))) {
                throw new Error(`Not enough balance to transfer NEP-17, missing: ${diff}`);
            }
            const argsTransfer = [
                {
                    type: 'Hash160',
                    value: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                },
                {
                    type: 'Hash160',
                    value: (0, helpers_1.getScriptHashFromAddress)(destination),
                },
                {
                    type: 'Integer',
                    value: amount,
                },
                {
                    type: 'String',
                    value: '',
                },
            ];
            const signers = [
                {
                    account: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                    scopes: 1,
                },
            ];
            const invokeParams = {
                scriptHash: quoteContract,
                operation: n3_2.Method.TRANSFER,
                args: argsTransfer,
                signers,
                networkFee: txObject.networkFee,
                systemFee: txObject.systemFee,
            };
            try {
                return this.invoke(invokeParams);
            }
            catch (e) {
                throw new Error(`transferNEP17: failed to execute ${n3_2.Method.TRANSFER} on ${quoteContract} with error: ${e}`);
            }
        });
    }
    /** Transfer one or more NEP-11 NFT(s)
     * @param {ITransferItem[]} items details.
     * @param {TxObject} txObject transaction object to send when calling `transferNEP11`.
     */
    transferNEP11(items, txObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const isTransferBatch = items.length > 1;
            console.log(`transferNEP11: transfer ${isTransferBatch ? 'bulk' : 'single'} nft on ${this._chainFullName}`);
            const argsTransferMultiple = [];
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const owner = yield this._ownerOf(item.baseContract, txObject.from, item.tokenId);
                if (owner.toLowerCase() !== txObject.from.toLowerCase())
                    throw new Error(`owner: ${owner} does not match tx.sender: ${txObject.from}`);
                argsTransferMultiple.push({
                    scriptHash: item.baseContract,
                    operation: n3_2.Method.TRANSFER,
                    args: [
                        {
                            type: 'Hash160',
                            value: (0, helpers_1.getScriptHashFromAddress)(item.destination),
                        },
                        {
                            type: 'ByteArray',
                            value: item.tokenId,
                        },
                        {
                            type: 'String',
                            value: '',
                        },
                    ],
                });
            }
            const signers = [
                {
                    account: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                    scopes: 1,
                },
            ];
            const invokeParamsMultiple = {
                invokeArgs: argsTransferMultiple,
                signers,
                networkFee: txObject.networkFee,
                systemFee: txObject.systemFee,
            };
            try {
                return this.invokeMultiple(invokeParamsMultiple);
            }
            catch (e) {
                throw new Error(`transferNEP11: failed to execute ${n3_2.Method.TRANSFER} on ${items[0].baseContract} with error: ${e}`);
            }
        });
    }
    /** Burn one or more NEP-11 NFT(s)
     * @param {IBurnItem[]} items details.
     * @param {TxObject} txObject transaction object to send when calling `burnNEP11`.
     */
    burnNEP11(items, txObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const isBurnBatch = items.length > 1;
            console.log(`burnNEP11: burn ${isBurnBatch ? 'bulk' : 'single'} nft on ${this._chainFullName}`);
            const argsBurnMultiple = [];
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const owner = yield this._ownerOf(item.contractAddress, txObject.from, item.tokenId);
                if (owner.toLowerCase() !== txObject.from.toLowerCase())
                    throw new Error(`owner: ${owner} does not match tx.sender: ${txObject.from}`);
                argsBurnMultiple.push({
                    scriptHash: item.contractAddress,
                    operation: n3_2.Method.BURN,
                    args: [
                        {
                            type: 'ByteArray',
                            value: item.tokenId,
                        },
                    ],
                });
            }
            const signers = [
                {
                    account: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                    scopes: 1,
                },
            ];
            const invokeParamsMultiple = {
                invokeArgs: argsBurnMultiple,
                signers,
                networkFee: txObject.networkFee,
                systemFee: txObject.systemFee,
            };
            try {
                return this.invokeMultiple(invokeParamsMultiple);
            }
            catch (e) {
                throw new Error(`burnNEP11: failed to execute ${n3_2.Method.BURN} on ${items[0].contractAddress} with error: ${e}`);
            }
        });
    }
    /** Mint one or more NEP-11 NFT(s)
     * @param {IMintItem} item details.
     * @param {TxObject} txObject transaction object to send when calling `mintNEP11`.
     */
    mintNEP11(item, txObject) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const quantity = (_a = item.quantity) !== null && _a !== void 0 ? _a : 1;
            if (quantity > 10)
                throw new Error(`You can only mint 10 NFT at once maximum.`);
            const isMintBatch = quantity > 1;
            console.log(`mintNEP11: minting ${isMintBatch ? 'bulk' : 'single'} nft on ${this._chainFullName}`);
            const isOnChainMetadata = true;
            const creatorAddress = txObject.from;
            const type = (_b = item.type) !== null && _b !== void 0 ? _b : 1;
            const hasLocked = false;
            const attributes = [];
            // display_type unused for now
            if (item.attrT1 !== '') {
                attributes.push({ trait_type: item.attrT1, value: item.attrV1 });
            }
            if (item.attrT2 !== '') {
                attributes.push({ trait_type: item.attrT2, value: item.attrV2 });
            }
            if (item.attrT3 !== '') {
                attributes.push({ trait_type: item.attrT3, value: item.attrV3 });
            }
            let jsonMetadata = JSON.stringify({
                name: item.name,
                description: item.description,
                image: item.imageURL,
                tokenURI: '',
                attributes,
                properties: {
                    has_locked: hasLocked,
                    type,
                },
            });
            if (!isOnChainMetadata) {
                jsonMetadata = JSON.stringify({
                    name: item.name,
                    tokenURI: item.externalURI,
                });
            }
            let contractRoyalties = '';
            if (item.royalties) {
                const arrayRoyalties = [];
                for (let i = 0; i < item.royalties.length; i++) {
                    arrayRoyalties.push({
                        address: item.royalties[i].address,
                        value: item.royalties[i].value.toString(),
                    });
                }
                contractRoyalties = JSON.stringify(arrayRoyalties);
            }
            let argsMint = [
                {
                    type: 'Hash160',
                    value: (0, helpers_1.getScriptHashFromAddress)(creatorAddress),
                },
                {
                    type: 'ByteArray',
                    value: (0, helpers_1.b64EncodeUnicode)(jsonMetadata),
                },
                {
                    type: 'ByteArray',
                    value: '', // lock content not available at the moment on SDK
                },
                {
                    type: 'ByteArray',
                    value: contractRoyalties ? btoa(contractRoyalties.toString()) : '',
                },
            ];
            if (isMintBatch) {
                const tokensMeta = [];
                const tokensLock = [];
                const tokensRoya = [];
                for (let i = 0; i < quantity; i++) {
                    tokensMeta.push({
                        type: 'ByteArray',
                        value: (0, helpers_1.b64EncodeUnicode)(jsonMetadata),
                    });
                    tokensLock.push({
                        type: 'ByteArray',
                        value: '', // lock content not available at the moment on SDK
                    });
                    tokensRoya.push({
                        type: 'ByteArray',
                        value: btoa(contractRoyalties.toString()),
                    });
                }
                argsMint = [
                    {
                        type: 'Hash160',
                        value: (0, helpers_1.getScriptHashFromAddress)(creatorAddress),
                    },
                    {
                        type: 'Array',
                        value: tokensMeta,
                    },
                    {
                        type: 'Array',
                        value: '', // lock content not available at the moment on SDK
                    },
                    {
                        type: 'Array',
                        value: tokensRoya,
                    },
                ];
            }
            const signers = [
                {
                    account: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                    scopes: 1,
                },
            ];
            const invokeParams = {
                scriptHash: this._contractNEP11Address,
                operation: isMintBatch ? n3_2.Method.MULTI_MINT : n3_2.Method.MINT,
                args: argsMint,
                signers,
                networkFee: txObject.networkFee,
                systemFee: txObject.systemFee,
            };
            try {
                return this.invoke(invokeParams);
            }
            catch (e) {
                throw new Error(`mintNEP11: failed to execute ${isMintBatch ? n3_2.Method.MULTI_MINT : n3_2.Method.MINT} on ${this._contractNEP11Address} with error: ${e}`);
            }
        });
    }
    /** Check one token balance for address
     * @param {string} contractAddress token contract to check approval.
     * @param {string} address address used to check.
     */
    checkTokenBalance(contractAddress, address) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`checkTokenBalance: checking ${contractAddress} balance for ${address} on ${this._chainFullName}`);
            const argsCheckTokenBalance = [
                {
                    type: 'Hash160',
                    value: (0, helpers_1.getScriptHashFromAddress)(address),
                },
            ];
            const signers = [
                {
                    account: (0, helpers_1.getScriptHashFromAddress)(address),
                    scopes: 1,
                },
            ];
            const invokeParams = {
                scriptHash: contractAddress,
                operation: n3_2.Method.BALANCE_OF,
                args: argsCheckTokenBalance,
                signers,
            };
            try {
                const response = yield this.invokeRead(invokeParams);
                if (response.exception)
                    return `checkTokenBalance exception: ${response.exception}`;
                return response.stack && response.stack[0] && response.stack[0].value;
            }
            catch (e) {
                throw new Error(`checkTokenBalance: failed to execute ${n3_2.Method.BALANCE_OF} on ${contractAddress} with error: ${e}`);
            }
        });
    }
    /** Check incentives for address
     * @param {string} address address used to check.
     */
    checkIncentives(address) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`checkIncentives: reading incentives on ${this._chainFullName}`);
            const argsCheckIncentives = [
                {
                    type: 'Hash160',
                    value: (0, helpers_1.getScriptHashFromAddress)(address),
                },
            ];
            const signers = [
                {
                    account: (0, helpers_1.getScriptHashFromAddress)(address),
                    scopes: 1,
                },
            ];
            const invokeParams = {
                scriptHash: this._contractIncentivesAddress,
                operation: n3_2.Method.GET_INCENTIVE,
                args: argsCheckIncentives,
                signers,
            };
            try {
                const response = yield this.invokeRead(invokeParams);
                if (response.exception)
                    return `checkIncentives exception: ${response.exception}`;
                return response.stack && response.stack[0] && response.stack[0].value;
            }
            catch (e) {
                throw new Error(`checkIncentives: failed to execute ${n3_2.Method.GET_INCENTIVE} on ${this._contractIncentivesAddress} with error: ${e}`);
            }
        });
    }
    /** Claim incentives for address
     * @param {TxObject} txObject transaction object to send when calling `claimIncentives`.
     */
    claimIncentives(txObject) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`claimIncentives: claiming incentives on ${this._chainFullName}`);
            const balance = yield this.checkIncentives(txObject.from);
            if (parseInt((_a = balance[5]) === null || _a === void 0 ? void 0 : _a.value) === 0) {
                throw new Error(`nothing to claim on incentives contract`);
            }
            const argsClaimIncentives = [
                {
                    type: 'Hash160',
                    value: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                },
            ];
            const signers = [
                {
                    account: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                    scopes: 1,
                },
            ];
            const invokeParams = {
                scriptHash: this._contractIncentivesAddress,
                operation: n3_2.Method.CLAIM,
                args: argsClaimIncentives,
                signers,
                networkFee: txObject.networkFee,
                systemFee: txObject.systemFee,
            };
            try {
                return this.invoke(invokeParams);
            }
            catch (e) {
                throw new Error(`claimIncentives: failed to execute ${n3_2.Method.CLAIM} on ${this._contractIncentivesAddress} with error: ${e}`);
            }
        });
    }
    /** Check stakes on LP staking contract for address
     * @param {string} accountAddress address used to check.
     */
    checkLPStakes(address) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`checkLPStakes: checking LP stakes for address ${address} on ${this._chainFullName}`);
            const argsCheckLPStakes = [
                {
                    type: 'Hash160',
                    value: (0, helpers_1.getScriptHashFromAddress)(address),
                },
                {
                    type: 'Hash160',
                    value: this._contractLPTokenAddress,
                },
            ];
            const signers = [
                {
                    account: (0, helpers_1.getScriptHashFromAddress)(address),
                    scopes: 1,
                },
            ];
            const invokeParams = {
                scriptHash: this._contractLPStakingAddress,
                operation: n3_2.Method.READ_LP_STAKES,
                args: argsCheckLPStakes,
                signers,
            };
            try {
                const response = yield this.invokeRead(invokeParams);
                if (response.exception)
                    return `checkLPStakes exception: ${response.exception}`;
                return (response.stack &&
                    response.stack[0] &&
                    response.stack[0].value &&
                    response.stack[0].value / Math.pow(10, 8));
            }
            catch (e) {
                throw new Error(`checkLPStakes: failed to execute ${n3_2.Method.READ_LP_STAKES} on ${this._contractLPStakingAddress} with error: ${e}`);
            }
        });
    }
    /** Check rewards on LP staking contract for address
     * @param {string} accountAddress address used to check.
     */
    checkLPRewards(accountAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`checkLPRewards: checking LP rewards for address ${accountAddress} on ${this._chainFullName}`);
            const argsCheckLPRewards = [
                {
                    type: 'Hash160',
                    value: (0, helpers_1.getScriptHashFromAddress)(accountAddress),
                },
                {
                    type: 'Hash160',
                    value: this._contractLPTokenAddress,
                },
            ];
            const signers = [
                {
                    account: (0, helpers_1.getScriptHashFromAddress)(accountAddress),
                    scopes: 1,
                },
            ];
            const invokeParams = {
                scriptHash: this._contractLPStakingAddress,
                operation: n3_2.Method.READ_LP_REWARDS,
                args: argsCheckLPRewards,
                signers,
            };
            try {
                const response = yield this.invokeRead(invokeParams);
                if (response.exception)
                    return `checkLPRewards exception: ${response.exception}`;
                return response.stack && response.stack[0] && response.stack[0].value;
            }
            catch (e) {
                throw new Error(`checkLPRewards: failed to execute ${n3_2.Method.READ_LP_REWARDS} on ${this._contractLPStakingAddress} with error: ${e}`);
            }
        });
    }
    /** Claim LP rewards on LP staking contract for address
     * @param {TxObject} txObject transaction object to send when calling `claimLPRewards`.
     */
    claimLPRewards(txObject) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`claimLPRewards: claiming LP Rewards on ${this._chainFullName}`);
            const balance = yield this.checkLPRewards(txObject.from);
            if (parseInt(balance) === 0) {
                throw new Error(`nothing to claim on LP staking contract`);
            }
            const argsClaimLPRewards = [
                {
                    type: 'Hash160',
                    value: txObject.from,
                },
                {
                    type: 'Hash160',
                    value: this._contractLPTokenAddress,
                },
            ];
            const signers = [
                {
                    account: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                    scopes: 1,
                },
            ];
            const invokeParams = {
                scriptHash: this._contractLPStakingAddress,
                operation: n3_2.Method.CLAIM_LP_INCENTIVES,
                args: argsClaimLPRewards,
                signers,
                networkFee: txObject.networkFee,
                systemFee: txObject.systemFee,
            };
            try {
                return this.invoke(invokeParams);
            }
            catch (e) {
                throw new Error(`claimLPRewards: failed to execute ${n3_2.Method.CLAIM_LP_INCENTIVES} on ${this._contractLPStakingAddress} with error: ${e}`);
            }
        });
    }
    /** Stake/Unstake LP tokens on LP staking contract for address
     * @param {string} amount value to stake or unstake.
     * @param {boolean} isStaking true if staking, or false if unstaking.
     * @param {TxObject} txObject transaction object to send when calling `stakeLPTokens`.
     */
    stakeLPTokens(amount, isStaking, txObject) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`stakeLPTokens: ${isStaking ? '' : 'un'}staking LP tokens on ${this._chainFullName}`);
            const argsStakeLP = [
                {
                    type: 'Hash160',
                    value: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                },
                {
                    type: 'Hash160',
                    value: this._contractLPStakingAddress,
                },
                {
                    type: 'Integer',
                    value: (parseInt(amount) / Math.pow(10, 10)).toString(),
                },
                {
                    type: 'Any',
                    value: '',
                },
            ];
            const argsUnstakeLP = [
                {
                    type: 'Hash160',
                    value: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                },
                {
                    type: 'Integer',
                    value: (parseInt(amount) / Math.pow(10, 10)).toString(),
                },
                {
                    type: 'Hash160',
                    value: this._contractLPTokenAddress,
                },
            ];
            const allowedContracts = [this._contractLPStakingAddress, this._contractLPTokenAddress];
            const signers = isStaking
                ? [
                    {
                        account: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                        scopes: 16,
                        allowedContracts,
                    },
                ]
                : [
                    {
                        account: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                        scopes: 1,
                    },
                ];
            const invokeParams = {
                scriptHash: isStaking ? this._contractLPTokenAddress : this._contractLPStakingAddress,
                operation: isStaking ? n3_2.Method.STAKE_LP : n3_2.Method.UNSTAKE_LP,
                args: isStaking ? argsStakeLP : argsUnstakeLP,
                signers,
                networkFee: txObject.networkFee,
                systemFee: txObject.systemFee,
            };
            try {
                return this.invoke(invokeParams);
            }
            catch (e) {
                throw new Error(`stakeLPTokens: failed to execute ${isStaking ? n3_2.Method.STAKE_LP : n3_2.Method.UNSTAKE_LP} on ${isStaking ? this._contractLPTokenAddress : this._contractLPStakingAddress} with error: ${e}`);
            }
        });
    }
    /** Swap method to convert from fromDesiredQuoteHash to fromAuctionQuoteHash tokens
     * @param {boolean} fromAuctionQuoteHash quote contract hash of listing.
     * @param {string} fromDesiredQuoteHash quote contract hash desired for payment.
     * @param {boolean} toPrice quote contract price required for payment.
     * @param {TxObject} txObject transaction object to send when calling `swapDexAmountOut`.
     */
    swapDexAmountOut(fromAuctionQuoteHash, fromDesiredQuoteHash, toPrice, txObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const allowedContracts = [this._contractDexAddress];
            const argsSwapFlamingo = [];
            const dexCallResults = yield this.addCallSwapDexAmountOut(txObject.from, fromAuctionQuoteHash, fromDesiredQuoteHash, toPrice);
            for (let i = 0; i < dexCallResults.scopes.length; i++) {
                if (!allowedContracts.includes(dexCallResults.scopes[i])) {
                    allowedContracts.push(dexCallResults.scopes[i]);
                }
            }
            argsSwapFlamingo.push(dexCallResults.invokes);
            const signers = [
                {
                    account: (0, helpers_1.getScriptHashFromAddress)(txObject.from),
                    scopes: this.provider === 'private' ? 128 : 16,
                    allowedContracts,
                },
            ];
            const invokeParamsMultiple = {
                invokeArgs: argsSwapFlamingo,
                signers,
                networkFee: txObject.networkFee,
                systemFee: txObject.systemFee,
            };
            try {
                return this.invokeMultiple(invokeParamsMultiple);
            }
            catch (e) {
                throw new Error(`swapDexAmountOut: failed to execute ${n3_2.Method.SWAP_TOKEN_OUT_FOR_TOKEN_IN} on ${this._contractDexAddress} with error: ${e}`);
            }
        });
    }
    /** Helper method returning amountIn for a swap of amountOut using paths
     * @param {string} accountAddress address used to check.
     * @param {string} amountOut amount out expected.
     * @param {IArgs[]} paths paths to use for calculation.
     */
    getSwapDexAmountsIn(accountAddress, amountOut, paths) {
        return __awaiter(this, void 0, void 0, function* () {
            const argsGetAmountsIn = [
                {
                    type: 'Integer',
                    value: amountOut,
                },
                {
                    type: 'Array',
                    value: paths,
                },
            ];
            const signers = [
                {
                    account: (0, helpers_1.getScriptHashFromAddress)(accountAddress),
                    scopes: 1,
                },
            ];
            const invokeParams = {
                scriptHash: this._contractDexAddress,
                operation: n3_2.Method.GET_AMOUNTS_IN,
                args: argsGetAmountsIn,
                signers,
            };
            try {
                const response = yield this.invokeRead(invokeParams);
                if (response.exception)
                    return `getSwapDexAmountsIn exception: ${response.exception}`;
                return (response.stack &&
                    response.stack[0] &&
                    response.stack[0].value &&
                    response.stack[0].value[0] &&
                    response.stack[0].value[0].value);
            }
            catch (e) {
                throw new Error(`getSwapDexAmountsIn: failed to execute ${n3_2.Method.ALLOWANCE} on ${this._contractDexAddress} with error: ${e}`);
            }
        });
    }
    /** Helper method returning scopes and invokes to convert from fromDesiredQuoteHash to fromAuctionQuoteHash tokens
     * @param {string} accountAddress address used to check.
     * @param {boolean} fromAuctionQuoteHash true if staking, or false if unstaking.
     * @param {string} fromDesiredQuoteHash value to stake or unstake.
     * @param {boolean} toPrice true if staking, or false if unstaking.
     * @param {TxObject} txObject transaction object to send when calling `stakeLPTokens`.
     */
    addCallSwapDexAmountOut(accountAddress, fromAuctionQuoteHash, fromDesiredQuoteHash, toPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            const scopes = [
                fromDesiredQuoteHash,
                this._contractDexAddress,
                this._contractFlmAddress,
                fromAuctionQuoteHash,
            ];
            let paths = [
                {
                    type: 'Hash160',
                    value: fromDesiredQuoteHash, // token to be used as payment - script hash
                },
                {
                    type: 'Hash160',
                    value: this._contractFlmAddress, // FLM script hash
                },
                {
                    type: 'Hash160',
                    value: fromAuctionQuoteHash, // quote contract script hash
                },
            ];
            if (fromAuctionQuoteHash === this._contractFlmAddress ||
                fromDesiredQuoteHash === this._contractFlmAddress) {
                paths = [
                    {
                        type: 'Hash160',
                        value: fromDesiredQuoteHash, // token to be used as payment - script hash
                    },
                    {
                        type: 'Hash160',
                        value: fromAuctionQuoteHash, // quote contract script hash
                    },
                ];
            }
            const amountIn = yield this.getSwapDexAmountsIn(accountAddress, toPrice, paths);
            const slippageBps = 1005;
            const amountInMax = bignumber_1.BigNumber.from(amountIn).mul(slippageBps).div(1000);
            const invokes = {
                scriptHash: this._contractDexAddress,
                operation: n3_2.Method.SWAP_TOKEN_OUT_FOR_TOKEN_IN,
                args: [
                    {
                        type: 'Hash160',
                        value: (0, helpers_1.getScriptHashFromAddress)(accountAddress),
                    },
                    {
                        type: 'Integer',
                        value: toPrice,
                    },
                    {
                        type: 'Integer',
                        value: amountInMax.toString(), // slippage set to 0.5% max
                    },
                    {
                        type: 'Array',
                        value: paths,
                    },
                    {
                        type: 'Integer',
                        value: (new Date().getTime() + 300000).toString(), // 5 minutes after current time
                    },
                ],
            };
            return { invokes, scopes };
        });
    }
    /** Sign Data
     * @param {string} dataToSign data to sign.
     */
    signData(dataToSign) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`signData: signing data on ${this._chainFullName}`);
            if (this.provider === 'private')
                throw new Error('Only supported on Neoline / O3 for now.');
            try {
                const signedMessage = yield this.getProvider().signMessage({ message: dataToSign });
                const { publicKey, message, salt, data } = signedMessage;
                console.log('Public key used to sign:', publicKey);
                console.log('Original message:', message);
                console.log('Salt added to message:', salt);
                console.log('Signed data:', data);
                return { signature: data, random: salt, pub_key: publicKey };
            }
            catch ({ type, description, data }) {
                switch (type) {
                    case 'NO_PROVIDER':
                        throw new Error('No provider available.');
                    case 'RPC_ERROR':
                        throw new Error('There was an error when broadcasting this transaction to the network.');
                    case 'CANCELLED':
                    case 'CANCELED':
                        throw new Error('The user has canceled this transaction.');
                    default:
                        throw new Error(description);
                }
            }
        });
    }
    /** Get FLM contract address
     * @param {string} chainName chain name to check.
     */
    _getFlmContractAddress(chainName) {
        return constants_1.AddressesByChain[chainName].FLM_TOKEN;
    }
    /** Get Dex contract address
     * @param {string} chainName chain name to check.
     */
    _getDexContractAddress(chainName) {
        return constants_1.AddressesByChain[chainName].DEX;
    }
    /** Get Incentives contract address
     * @param {string} chainName chain name to check.
     */
    _getIncentivesContractAddress(chainName) {
        return constants_1.AddressesByChain[chainName].INCENTIVES;
    }
    /** Get LP Staking contract address
     * @param {string} chainName chain name to check.
     */
    _getLPStakingContractAddress(chainName) {
        return constants_1.AddressesByChain[chainName].LP_STAKING;
    }
    /** Get LP Token contract address
     * @param {string} chainName chain name to check.
     */
    _getLPTokenContractAddress(chainName) {
        return constants_1.AddressesByChain[chainName].LP_TOKEN;
    }
    /** Get NEP-11 Ghost contract address
     * @param {string} chainName chain name to check.
     */
    _getNEP11GhostContractAddress(chainName) {
        return constants_1.AddressesByChain[chainName].GHOST_NEP11;
    }
    /** Get Exchange contract address
     * @param {string} chainName chain name to check.
     */
    _getExchangeContractAddress(chainName) {
        return constants_1.AddressesByChain[chainName].EXCHANGE;
    }
    /** Get Management contract address
     * @param {string} chainName chain name to check.
     */
    _getManagementContractAddress(chainName) {
        return constants_1.AddressesByChain[chainName].CONTRACT_MANAGEMENT;
    }
    /** Get owner of a contract
     * @param {string} contractAddress contract address.
     */
    /* private _getOwner(contractAddress: string): Promise<string> {
        console.log(
            `_getOwner: checking contract ownership for contract ${contractAddress} on ${this._chainFullName}`,
        )

        throw new Error('Feature not available on Neo N3 yet!')
    } */
    /** Get owner of an NEP-11 NFT
     * @param {string} contractAddress contract address of NFT.
     * @param {string} address address used to check.
     * @param {string} tokenId tokenId of NFT.
     */
    _ownerOf(contractAddress, address, tokenId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`_ownerOf: checking NEP-11 owner for contract ${contractAddress} for token id ${tokenId} on ${this._chainFullName}`);
            const argsCheckOwnerOf = [
                {
                    type: 'ByteArray',
                    value: tokenId,
                },
            ];
            const signers = [
                {
                    account: (0, helpers_1.getScriptHashFromAddress)(address),
                    scopes: 1,
                },
            ];
            const invokeParams = {
                scriptHash: contractAddress,
                operation: n3_2.Method.OWNER_OF,
                args: argsCheckOwnerOf,
                signers,
            };
            try {
                const response = yield this.invokeRead(invokeParams);
                if (response.exception)
                    return `_ownerOf exception: ${response.exception}`;
                const owner = (_a = response.stack[0]) === null || _a === void 0 ? void 0 : _a.value;
                console.log(`NFT ${tokenId} from contract ${contractAddress} current owner: ${neon_js_1.wallet.getAddressFromScriptHash(neon_js_1.u.reverseHex(neon_js_1.u.HexString.fromBase64(owner).toString()))}`);
                return neon_js_1.wallet.getAddressFromScriptHash(neon_js_1.u.reverseHex(neon_js_1.u.HexString.fromBase64(owner).toString()));
            }
            catch (e) {
                console.log(e);
                return n3_1.NULL_ADDRESS_N3;
            }
        });
    }
    /** Get contract support for one particular standard
     * @param {string} contractAddress contract address to check.
     * @param {string} address address used to check.
     * @param {string} standard standard to check.
     */
    _supportsStandard(contractAddress, address, standard) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`_supportsStandard: checking support for ${standard} for contract ${contractAddress} on ${this._chainFullName}`);
            const argsGetContract = [
                {
                    type: 'Hash160',
                    value: contractAddress,
                },
            ];
            const signers = [
                {
                    account: (0, helpers_1.getScriptHashFromAddress)(address),
                    scopes: 1,
                },
            ];
            const invokeParams = {
                scriptHash: this._contractManagementAddress,
                operation: n3_2.Method.GET_CONTRACT,
                args: argsGetContract,
                signers,
            };
            try {
                const response = yield this.invokeRead(invokeParams);
                if (response.exception)
                    return `_supportsStandard exception: ${response.exception}`;
                const supportedStandards = (_c = (_b = (_a = response.stack[0]) === null || _a === void 0 ? void 0 : _a.value[4]) === null || _b === void 0 ? void 0 : _b.value[3]) === null || _c === void 0 ? void 0 : _c.value;
                let supportsStandard = false;
                for (let i = 0; i < supportedStandards.length; i++) {
                    if (atob((_d = supportedStandards[i]) === null || _d === void 0 ? void 0 : _d.value) === standard)
                        supportsStandard = true;
                }
                console.log(`${standard} support: ${supportsStandard}`);
                return supportsStandard;
            }
            catch (e) {
                throw new Error(`_supportsStandard: failed to execute ${n3_2.Method.GET_CONTRACT} on ${this._contractManagementAddress} with error: ${e}`);
            }
        });
    }
    /** Get Provider
     */
    getProvider() {
        switch (this.provider) {
            case 'private': {
                return new N3PrivateProvider_1.N3PrivateProvider(this._providerRPCUrl, this._privateKey, this._isMainNet);
            }
            case 'neoline': {
                const win = window;
                if (!win.NEOLineN3) {
                    throw new Error('Neoline not installed. Please install it and try again.');
                }
                return new win.NEOLineN3.Init();
            }
            case 'o3':
            default:
                // eslint-disable-next-line no-case-declarations
                const win = window;
                if (!win.neo3Dapi) {
                    throw new Error('O3 not installed. Please install it and try again.');
                }
                return win.neo3Dapi;
        }
    }
    invoke(invokeParams) {
        if (invokeParams.networkFee && (this.provider === 'neoline' || this.provider === 'o3')) {
            invokeParams.fee = invokeParams.networkFee;
        }
        if (invokeParams.systemFee && this.provider === 'neoline') {
            invokeParams.overrideSystemFee = invokeParams.systemFee;
        }
        if (invokeParams.systemFee && this.provider === 'o3') {
            invokeParams.extraSystemFee = invokeParams.systemFee;
        }
        return new Promise((resolve, reject) => {
            this.getProvider()
                .invoke(invokeParams)
                .then((result) => {
                console.log('Invoke transaction success!');
                console.log('--- Transaction hash ---');
                console.log(result.txid);
                resolve(result.txid);
            })
                .catch(({ type, description }) => {
                let errMsg = 'Unknown error';
                switch (type) {
                    case 'NO_PROVIDER':
                        errMsg = 'No provider available.';
                        break;
                    case 'RPC_ERROR':
                        errMsg =
                            'There was an error when broadcasting this transaction to the network.';
                        if (description.exception) {
                            errMsg = description.exception;
                        }
                        break;
                    case 'CANCELLED':
                    case 'CANCELED':
                        errMsg = 'The user has cancelled this transaction.';
                        break;
                    default:
                        if (description) {
                            errMsg = description;
                        }
                        if (description && description.msg) {
                            errMsg = description.msg;
                        }
                }
                reject(new Error(errMsg));
            });
        });
    }
    invokeMultiple(invokeParams) {
        if (invokeParams.networkFee && (this.provider === 'neoline' || this.provider === 'o3')) {
            invokeParams.fee = invokeParams.networkFee;
        }
        if (invokeParams.systemFee && this.provider === 'neoline') {
            invokeParams.overrideSystemFee = invokeParams.systemFee;
        }
        if (invokeParams.systemFee && this.provider === 'o3') {
            invokeParams.extraSystemFee = invokeParams.systemFee;
        }
        return new Promise((resolve, reject) => {
            ;
            (this.provider === 'o3'
                ? this.getProvider().invokeMulti(invokeParams)
                : this.getProvider().invokeMultiple(invokeParams))
                .then((result) => {
                console.log('Invoke multiple transaction success!');
                console.log('--- Transaction hash ---');
                console.log(result.txid);
                resolve(result.txid);
            })
                .catch(({ type, description }) => {
                let errMsg = 'Unknown error';
                switch (type) {
                    case 'NO_PROVIDER':
                        errMsg = 'No provider available.';
                        break;
                    case 'RPC_ERROR':
                        errMsg =
                            'There was an error when broadcasting this transaction to the network.';
                        if (description.exception) {
                            errMsg = description.exception;
                        }
                        break;
                    case 'CANCELLED':
                    case 'CANCELED':
                        errMsg = 'The user has cancelled this transaction.';
                        break;
                    default:
                        if (description) {
                            errMsg = description;
                        }
                        if (description && description.msg) {
                            errMsg = description.msg;
                        }
                }
                reject(new Error(errMsg));
            });
        });
    }
    invokeRead(invokeParams) {
        // console.log('invokeRead', invokeParams)
        return new Promise((resolve, reject) => {
            this.getProvider()
                .invokeRead(invokeParams)
                .then((result) => {
                console.log('InvokeRead success!');
                resolve(result);
            })
                .catch(({ type, description }) => {
                let errMsg = 'Unknown error';
                switch (type) {
                    case 'NO_PROVIDER':
                        errMsg = 'No provider available.';
                        break;
                    case 'Remote rpc error':
                    case 'RPC_ERROR':
                        errMsg =
                            'There was an error when broadcasting this transaction to the network.';
                        if (description.exception) {
                            errMsg = description.exception;
                        }
                        break;
                    case 'User rejected':
                    case 'CANCELLED':
                    case 'CANCELED':
                        errMsg = 'The user has cancelled this transaction.';
                        break;
                    default:
                        if (description) {
                            errMsg = description;
                        }
                        if (description && description.msg) {
                            errMsg = description.msg;
                        }
                }
                reject(new Error(errMsg));
            });
        });
    }
    invokeReadMultiple(invokeParams) {
        // console.log('invokeRead', invokeParams)
        return new Promise((resolve, reject) => {
            this.getProvider();
            (this.provider === 'o3'
                ? this.getProvider().invokeReadMulti(invokeParams)
                : this.getProvider().invokeReadMultiple(invokeParams))
                .then((result) => {
                console.log('InvokeRead success!');
                resolve(result);
            })
                .catch(({ type, description }) => {
                let errMsg = 'Unknown error';
                switch (type) {
                    case 'NO_PROVIDER':
                        errMsg = 'No provider available.';
                        break;
                    case 'Remote rpc error':
                    case 'RPC_ERROR':
                        errMsg =
                            'There was an error when broadcasting this transaction to the network.';
                        if (description.exception) {
                            errMsg = description.exception;
                        }
                        break;
                    case 'User rejected':
                    case 'CANCELLED':
                    case 'CANCELED':
                        errMsg = 'The user has cancelled this transaction.';
                        break;
                    default:
                        if (description) {
                            errMsg = description;
                        }
                        if (description && description.msg) {
                            errMsg = description.msg;
                        }
                }
                reject(new Error(errMsg));
            });
        });
    }
}
exports.GhostMarketN3SDK = GhostMarketN3SDK;
//# sourceMappingURL=sdk.n3.js.map