"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.GhostMarketSDK = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
const web3_1 = __importDefault(require("web3"));
const bignumber_1 = require("@ethersproject/bignumber");
const abi_1 = require("./abi");
const constants_1 = require("./constants");
const evm_1 = require("./constants/evm");
const assets_1 = require("../utils/evm/assets");
const hash_1 = require("../utils/evm/hash");
const order_1 = require("../utils/evm/order");
const gm_api_js_1 = require("@onblockio/gm-api-js/");
class GhostMarketSDK {
  /**
   * Your instance of GhostMarket.
   * Make API calls and GhostMarket Smart Contract method calls.
   * @param  {Web3['currentProvider']} provider To use for creating a Web3 instance. Can be also be `window.ethereum` for browser injected web3 providers.
   * @param  {GhostMarketSDKConfig} options with options for accessing GhostMarket SDK.
   * @param  {(arg:string)=>void} logger? // Optional logger function for logging debug messages.
   */
  constructor(provider, options, logger) {
    var _a;
    options.apiKey = options.apiKey || "";
    options.environment = options.environment || constants_1.MAINNET_API_URL;
    options.rpcUrl = options.rpcUrl || "";
    const useReadOnlyProvider =
      (_a = options.useReadOnlyProvider) !== null && _a !== void 0 ? _a : false;
    this._isReadonlyProvider = useReadOnlyProvider;
    options.chainName = options.chainName || gm_api_js_1.ChainNetwork.Eth;
    this._chainName = options.chainName;
    this._chainFullName = constants_1.ChainFullName[this._chainName];
    this._chainCurrency = constants_1.ChainCurrency[this._chainName];
    this._chainId = 12227332;
    this.web3 = new web3_1.default(provider);
    const apiConfig = {
      apiKey: options.apiKey,
      baseUrl: options.environment,
    };
    this.api = new gm_api_js_1.GhostMarketApi(apiConfig);
    // Logger: Default to nothing.
    this.logger = logger || ((arg) => arg);
  }
  /** Create one or more sell order or nft offer or collection offer
   * @param {IOrderItem[]} items items for the order or offer.
   */
  createOrder(items) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      for (let i = 0; i < items.length; i++) {
        console.log(
          `createOrder: create ${
            items[i].type === 1
              ? "listing"
              : items[i].type === 2
              ? "offer"
              : "collection offer"
          } on ${this._chainFullName}`
        );
        if (this._isReadonlyProvider)
          throw new Error(
            `Can not sign transaction with a read only provider.`
          );
        if (items[i].type !== 3 && !items[i].baseTokenId)
          throw new Error(
            `baseTokenId is required to place an offer or an order.`
          );
        try {
          // check very low or very high price values
          const wrappedTokenAddress = this._getWrappedTokenContractAddress(
            this._chainName
          );
          if (
            items[i].quoteContract === "0x" ||
            items[i].quoteContract.toLowerCase() ===
              wrappedTokenAddress.toLowerCase()
          ) {
            if (
              bignumber_1.BigNumber.from(items[i].quotePrice).gt(
                bignumber_1.BigNumber.from("10000000000000000000000")
              ) ||
              bignumber_1.BigNumber.from(items[i].quotePrice).lt(
                bignumber_1.BigNumber.from("10000000000000")
              )
            ) {
              throw new Error(
                `quote price: ${items[i].quotePrice} out of range (10000000000000-10000000000000000000000)`
              );
            }
          }
          // check quote contract is approved if it's an offer/collection offer
          if (items[i].type !== 1 && items[i].quoteContract !== "0x") {
            const amountApproved = yield this.checkTokenApproval(
              items[i].quoteContract,
              items[i].makerAddress
            );
            const hasApprovedEnough =
              bignumber_1.BigNumber.from(amountApproved) >
              bignumber_1.BigNumber.from(items[i].quotePrice);
            if (!hasApprovedEnough)
              throw new Error(
                `quote contract: ${items[i].quoteContract} spender allowance exceeded for: ${items[i].makerAddress}`
              );
            // check quote balance enough if it's an offer/collection offer
            const balance = yield this.checkTokenBalance(
              items[i].quoteContract,
              items[i].makerAddress
            );
            const amountDiff = bignumber_1.BigNumber.from(items[i].quotePrice);
            const balanceDiff = bignumber_1.BigNumber.from(balance.toString());
            const diff = amountDiff.sub(balanceDiff);
            if (diff.gt(bignumber_1.BigNumber.from(0))) {
              throw new Error(
                `Not enough balance of contract ${
                  items[i].quoteContract
                } to place offer, missing: ${bignumber_1.BigNumber.from(diff)}`
              );
            }
          }
          // check base token is nft
          const supportsERC721 = yield this._supportsERC721(
            items[i].baseContract
          );
          const supportsERC155 = yield this._supportsERC1155(
            items[i].baseContract
          );
          if (!supportsERC721 && !supportsERC155)
            throw new Error(
              `base contract: ${items[i].baseContract} does not support ERC721 or ERC1155`
            );
          // check quote token is not nft
          if (items[i].quoteContract !== "0x") {
            try {
              const quoteSupportsERC721 = yield this._supportsERC721(
                items[i].quoteContract
              );
              const quoteSupportsERC1155 = yield this._supportsERC1155(
                items[i].quoteContract
              );
              if (quoteSupportsERC721 || quoteSupportsERC1155) {
                throw new Error(
                  `quote contract: ${items[i].quoteContract} should not support ERC721 or ERC1155`
                );
              }
              // eslint-disable-next-line no-empty
            } catch (err) {}
          }
          // check contract approved on listing
          if (items[i].type === 1) {
            const approved = yield this.checkContractApproval(
              items[i].baseContract,
              items[i].makerAddress
            );
            if (!approved)
              throw new Error(
                `base contract: ${items[i].baseContract} not approved by: ${items[i].makerAddress}`
              );
          }
          // check owner match on listing erc721
          if (items[i].type === 1 && supportsERC721) {
            const owner = yield this._ownerOf(
              items[i].baseContract,
              items[i].baseTokenId
            );
            if (owner.toLowerCase() !== items[i].makerAddress.toLowerCase())
              throw new Error(
                `owner: ${owner} does not match maker: ${items[i].makerAddress}`
              );
            // check owner match on listing erc1155
          } else if (items[i].type === 1 && supportsERC155) {
            const balance = yield this._balanceOf(
              items[i].makerAddress,
              items[i].baseContract,
              items[i].baseTokenId
            );
            if (balance === 0)
              throw new Error(
                `owner: ${items[i].makerAddress} does not own enough token ${items[i].baseTokenId}`
              );
          }
          // check token id exist on offer
          if (items[i].type === 2 && supportsERC721) {
            const owner = yield this._ownerOf(
              items[i].baseContract,
              items[i].baseTokenId
            );
            if (owner === evm_1.NULL_ADDRESS_EVM)
              throw new Error(
                `token: ${items[i].baseTokenId} does not exist on contract: ${items[i].baseContract}`
              );
          }
          const salt =
            "0x" +
            [...Array(16)]
              .map(() => Math.floor(Math.random() * 16).toString(16))
              .join("");
          const baseTokenAmount = items[i].baseTokenAmount
            ? supportsERC721
              ? 1
              : items[i].baseTokenAmount
            : 1;
          const encType = supportsERC721 ? assets_1.ERC721 : assets_1.ERC1155;
          const now = new Date().getTime() / 1000;
          const startDate = items[i].startDate
            ? parseInt(items[i].startDate.toString()) < now
              ? parseInt(now.toString())
              : items[i].startDate
            : now;
          const endDate =
            (_a = items[i].endDate) !== null && _a !== void 0 ? _a : 0;
          const maxAllowedDate = new Date().getTime() + 15552000; // SECONDS_PER_180_DAYS
          if (endDate > maxAllowedDate) {
            throw new Error(
              `${
                items[i].type === 1
                  ? "listing"
                  : items[i].type === 2
                  ? "offer"
                  : "collection offer"
              } must have an end date, with a maximum of 180 days from now`
            );
          }
          const order = (0, order_1.Order)(
            items[i].makerAddress,
            items[i].type === 2 || items[i].type === 3
              ? (0, order_1.Asset)(
                  items[i].quoteContract === "0x"
                    ? assets_1.ETH
                    : assets_1.ERC20,
                  (0, order_1.enc)(items[i].quoteContract),
                  items[i].quotePrice
                )
              : (0, order_1.Asset)(
                  encType,
                  (0, order_1.enc)(items[i].baseContract, items[i].baseTokenId),
                  baseTokenAmount.toString()
                ),
            evm_1.NULL_ADDRESS_EVM,
            items[i].type === 2
              ? (0, order_1.Asset)(
                  encType,
                  (0, order_1.enc)(items[i].baseContract, items[i].baseTokenId),
                  baseTokenAmount.toString()
                )
              : items[i].type === 3
              ? (0, order_1.Asset)(
                  assets_1.COLLECTION,
                  (0, order_1.enc)(items[i].baseContract),
                  baseTokenAmount.toString()
                )
              : (0, order_1.Asset)(
                  items[i].quoteContract === "0x"
                    ? assets_1.ETH
                    : assets_1.ERC20,
                  (0, order_1.enc)(items[i].quoteContract),
                  items[i].quotePrice
                ),
            salt,
            startDate,
            endDate,
            "0xffffffff",
            "0x"
          );
          const verifyingContract = this._getExchangeV2ProxyContractAddress(
            this._chainName
          );
          const signature = yield (0, order_1.sign)(
            order,
            items[i].makerAddress,
            verifyingContract,
            this.web3,
            this._chainId
          );
          const orderKeyHash = (0, hash_1.hashKey)(order);
          const orderParams = {
            domain: {
              chainId: this._chainId.toString(),
              verifyingContract,
            },
            order: Object.assign(Object.assign({}, order), {
              orderKeyHash: orderKeyHash,
            }),
            signature,
          };
          console.log("orderParams: ", orderParams);
          const nftToList = new gm_api_js_1.PutEvmOrderV2Request(orderParams);

          const result = yield this.api.putEvmOrderV2({
            ...nftToList,
            order: {
              ...nftToList.order,
              originFees: [
                {
                  address: "0xA0Dc1C6Fa5593ADd23B34683542181A2177c8a7d",
                  value: 1,
                },
              ],
              payouts: [
                {
                  address: "0xA0Dc1C6Fa5593ADd23B34683542181A2177c8a7d",
                  value: 1,
                },
              ],
            },
          });
          return result;
        } catch (e) {
          throw new Error(
            `Failed to execute postCreateOrder ${i + 1} with error: ${e}`
          );
        }
      }
      return {};
    });
  }
  /** Cancel one or more sell order or nft offer or collection offer
   * @param {IOrderItem[]} items[] items for the order or offer cancel.
   * @param {TxObject} txObject transaction object to send when calling `bulkCancelOrders`.
   */
  bulkCancelOrders(items, txObject) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(
        `bulkCancelOrders: cancel ${items.length} order${
          items.length > 1 ? "s" : ""
        } on ${this._chainFullName}`
      );
      if (this._isReadonlyProvider)
        throw new Error(`Can not sign transaction with a read only provider.`);
      const exchangeV2ProxyAddress = this._getExchangeV2ProxyContractAddress(
        this._chainName
      );
      const ExchangeV2CoreContractInstance = new this.web3.eth.Contract(
        abi_1.ExchangeV2Contract,
        exchangeV2ProxyAddress
      );
      const ordersArray = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type !== 3 && !items[i].baseTokenId)
          throw new Error(
            `baseTokenId is required to cancel an offer or an order.`
          );
        const supportsERC721 = yield this._supportsERC721(
          items[i].baseContract
        );
        if (items[i].makerAddress.toLowerCase() !== txObject.from.toLowerCase())
          throw new Error(
            `maker: ${items[i].makerAddress} does not match tx.sender: ${txObject.from}`
          );
        const baseTokenAmount = items[i].baseTokenAmount
          ? supportsERC721
            ? 1
            : items[i].baseTokenAmount
          : 1;
        const encType = supportsERC721 ? assets_1.ERC721 : assets_1.ERC1155;
        const order = (0, order_1.Order)(
          items[i].makerAddress,
          items[i].type === 2 || items[i].type === 3
            ? (0, order_1.Asset)(
                items[i].quoteContract === "0x" ? assets_1.ETH : assets_1.ERC20,
                (0, order_1.enc)(items[i].quoteContract),
                items[i].quotePrice
              )
            : (0, order_1.Asset)(
                encType,
                (0, order_1.enc)(items[i].baseContract, items[i].baseTokenId),
                baseTokenAmount.toString()
              ),
          evm_1.NULL_ADDRESS_EVM,
          items[i].type === 2
            ? (0, order_1.Asset)(
                encType,
                (0, order_1.enc)(items[i].baseContract, items[i].baseTokenId),
                baseTokenAmount.toString()
              )
            : items[i].type === 3
            ? (0, order_1.Asset)(
                assets_1.COLLECTION,
                (0, order_1.enc)(items[i].baseContract),
                baseTokenAmount.toString()
              )
            : (0, order_1.Asset)(
                items[i].quoteContract === "0x" ? assets_1.ETH : assets_1.ERC20,
                (0, order_1.enc)(items[i].quoteContract),
                items[i].quotePrice
              ),
          items[i].salt,
          items[i].startDate,
          items[i].endDate,
          "0xffffffff",
          "0x"
        );
        ordersArray.push(order);
      }
      try {
        const data =
          yield ExchangeV2CoreContractInstance.methods.bulkCancelOrders(
            ordersArray
          );
        return this.sendMethod(
          data,
          txObject.from,
          exchangeV2ProxyAddress,
          undefined
        );
      } catch (e) {
        throw new Error(
          `bulkCancelOrders: failed to execute bulkCancelOrders on ${exchangeV2ProxyAddress} with error: ${JSON.stringify(
            e
          )}`
        );
      }
    });
  }
  /** Prepare match of a sell order or a single nft offer or a collection offer
   * @param {IOrderItem} orderMaker order to match.
   * @param {TxObject} txObject transaction object to send when calling `matchOrders`.
   */
  matchOrders(orderMaker, txObject) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(
        `matchOrders: matching ${
          orderMaker.type === 1
            ? "listing"
            : orderMaker.type === 2
            ? "offer"
            : "collection offer"
        } on ${this._chainFullName}`
      );
      if (this._isReadonlyProvider)
        throw new Error(`Can not sign transaction with a read only provider.`);
      if (!orderMaker.baseTokenId)
        throw new Error(
          `baseTokenId is required to match an offer or an order.`
        );
      try {
        const supportsERC721 = yield this._supportsERC721(
          orderMaker.baseContract
        );
        if (
          orderMaker.makerAddress.toLowerCase() === txObject.from.toLowerCase()
        )
          throw new Error(
            `maker: ${orderMaker.makerAddress} and tx.sender: ${txObject.from} can not be the same`
          );
        const baseTokenAmount = orderMaker.baseTokenAmount
          ? supportsERC721
            ? 1
            : orderMaker.baseTokenAmount
          : 1;
        const encType = supportsERC721 ? assets_1.ERC721 : assets_1.ERC1155;
        const _orderMaker = (0, order_1.Order)(
          orderMaker.type === 2 || orderMaker.type === 1
            ? orderMaker.makerAddress
            : txObject.from,
          orderMaker.type === 3 || orderMaker.type === 1
            ? (0, order_1.Asset)(
                encType,
                (0, order_1.enc)(
                  orderMaker.baseContract,
                  orderMaker.baseTokenId
                ),
                baseTokenAmount.toString()
              )
            : (0, order_1.Asset)(
                orderMaker.quoteContract === "0x"
                  ? assets_1.ETH
                  : assets_1.ERC20,
                (0, order_1.enc)(orderMaker.quoteContract),
                orderMaker.quotePrice
              ),
          evm_1.NULL_ADDRESS_EVM,
          orderMaker.type === 3 || orderMaker.type === 1
            ? (0, order_1.Asset)(
                orderMaker.quoteContract === "0x"
                  ? assets_1.ETH
                  : assets_1.ERC20,
                (0, order_1.enc)(orderMaker.quoteContract),
                orderMaker.quotePrice
              )
            : (0, order_1.Asset)(
                encType,
                (0, order_1.enc)(
                  orderMaker.baseContract,
                  orderMaker.baseTokenId
                ),
                baseTokenAmount.toString()
              ),
          orderMaker.salt,
          orderMaker.startDate,
          orderMaker.endDate,
          "0xffffffff",
          "0x"
        );
        const _orderTaker = (0, order_1.Order)(
          orderMaker.type === 2 || orderMaker.type === 1
            ? txObject.from
            : orderMaker.makerAddress,
          orderMaker.type === 3 || orderMaker.type === 1
            ? (0, order_1.Asset)(
                orderMaker.quoteContract === "0x"
                  ? assets_1.ETH
                  : assets_1.ERC20,
                (0, order_1.enc)(orderMaker.quoteContract),
                orderMaker.quotePrice
              )
            : (0, order_1.Asset)(
                encType,
                (0, order_1.enc)(
                  orderMaker.baseContract,
                  orderMaker.baseTokenId
                ),
                baseTokenAmount.toString()
              ),
          evm_1.NULL_ADDRESS_EVM,
          orderMaker.type === 2
            ? (0, order_1.Asset)(
                orderMaker.quoteContract === "0x"
                  ? assets_1.ETH
                  : assets_1.ERC20,
                (0, order_1.enc)(orderMaker.quoteContract),
                orderMaker.quotePrice
              )
            : orderMaker.type === 3
            ? (0, order_1.Asset)(
                assets_1.COLLECTION,
                (0, order_1.enc)(orderMaker.baseContract),
                baseTokenAmount.toString()
              )
            : (0, order_1.Asset)(
                encType,
                (0, order_1.enc)(
                  orderMaker.baseContract,
                  orderMaker.baseTokenId
                ),
                baseTokenAmount.toString()
              ),
          orderMaker.salt,
          orderMaker.startDate,
          orderMaker.endDate,
          "0xffffffff",
          "0x"
        );
        const _signatureTaker = "0x";
        const priceTotal = bignumber_1.BigNumber.from(orderMaker.quotePrice);
        const priceToSend =
          orderMaker.quoteContract === "0x" && orderMaker.type === 1
            ? priceTotal
                .add(
                  priceTotal
                    .mul(constants_1.GHOSTMARKET_TRADE_FEE_BPS)
                    .div(10000)
                )
                .toString()
            : undefined;
        txObject = {
          from: txObject.from,
          value: priceToSend,
        };
        return this._matchOrders(
          _orderMaker,
          orderMaker.type === 3 ? _signatureTaker : orderMaker.signature,
          _orderTaker,
          orderMaker.type === 3 ? orderMaker.signature : _signatureTaker,
          txObject
        );
      } catch (e) {
        throw new Error(
          `matchOrders: failed to execute with error: ${JSON.stringify(e)}`
        );
      }
    });
  }
  /** Match orders
   * @param {IEVMOrder} orderLeft order left to match.
   * @param {string} signatureLeft signature left to match.
   * @param {IEVMOrder} orderRight order right to match.
   * @param {string} signatureRight signature right to match.
   * @param {TxObject} txObject transaction object to send when calling `_matchOrders`.
   */
  _matchOrders(orderLeft, signatureLeft, orderRight, signatureRight, txObject) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._isReadonlyProvider)
        throw new Error(`Can not sign transaction with a read only provider.`);
      const exchangeV2ProxyAddress = this._getExchangeV2ProxyContractAddress(
        this._chainName
      );
      const ExchangeV2CoreContractInstance = new this.web3.eth.Contract(
        abi_1.ExchangeV2Contract,
        exchangeV2ProxyAddress
      );
      try {
        const data = yield ExchangeV2CoreContractInstance.methods.matchOrders(
          orderLeft,
          signatureLeft,
          orderRight,
          signatureRight
        );
        return this.sendMethod(
          data,
          txObject.from,
          exchangeV2ProxyAddress,
          txObject.value
        );
      } catch (e) {
        throw new Error(`_matchOrders: failed to execute matchOrders on ${exchangeV2ProxyAddress} with error:
                ${JSON.stringify(e)}`);
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
      console.log(
        `setRoyaltiesForContract: set royalties for contract ${contractAddress} on ${this._chainFullName}`
      );
      if (this._isReadonlyProvider)
        throw new Error(`Can not sign transaction with a read only provider.`);
      const supportsERC721 = yield this._supportsERC721(contractAddress);
      const supportsERC155 = yield this._supportsERC1155(contractAddress);
      if (!supportsERC721 && !supportsERC155)
        throw new Error(
          `contract: ${contractAddress} does not support ERC721 or ERC1155`
        );
      const owner = yield this._getOwner(contractAddress, supportsERC721);
      if (owner.toLowerCase() !== txObject.from.toLowerCase())
        throw new Error(
          `owner: ${owner} does not match tx.sender: ${txObject.from}`
        );
      const royaltiesRegistryProxyAddress =
        this._getRoyaltiesRegistryContractAddress(this._chainName);
      const RoyaltiesRegistryContractInstance = new this.web3.eth.Contract(
        abi_1.RoyaltiesRegistryContract,
        royaltiesRegistryProxyAddress
      );
      const contractRoyalties = [];
      if (royalties) {
        for (let i = 0; i < royalties.length; i++) {
          contractRoyalties.push([
            royalties[i].address,
            royalties[i].value.toString(),
          ]);
        }
      }
      try {
        const data =
          yield RoyaltiesRegistryContractInstance.methods.setRoyaltiesByToken(
            contractAddress,
            contractRoyalties
          );
        return this.sendMethod(
          data,
          txObject.from,
          royaltiesRegistryProxyAddress,
          undefined
        );
      } catch (e) {
        throw new Error(`setRoyaltiesForContract: failed to execute setRoyaltiesByToken on ${royaltiesRegistryProxyAddress} with error: 
                ${JSON.stringify(e)}`);
      }
    });
  }
  /** Wrap token or unwrap token
   * @param {string} amount value to wrap token from/to.
   * @param {boolean} isFromNativeToWrap true if native to wrap, or false from wrap to native.
   * @param {TxObject} txObject transaction object to send when calling `wrapToken`.
   */
  wrapToken(amount, isFromNativeToWrap, txObject) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(
        `wrapToken: ${
          isFromNativeToWrap ? "" : "un"
        }wrap token amount of ${amount} on ${this._chainFullName}`
      );
      if (this._isReadonlyProvider)
        throw new Error(`Can not sign transaction with a read only provider.`);
      const wrappedTokenAddress = this._getWrappedTokenContractAddress(
        this._chainName
      );
      const WrappedTokenContractInstance = new this.web3.eth.Contract(
        abi_1.ERC20WrappedContract,
        wrappedTokenAddress
      );
      if (isFromNativeToWrap) {
        const bal = yield this.checkBalance(txObject.from);
        let balance = 0;
        if (bal) {
          balance = parseFloat(bal);
        }
        const amountDiff = bignumber_1.BigNumber.from(amount);
        const balanceDiff = bignumber_1.BigNumber.from(balance.toString());
        const diff = amountDiff.sub(balanceDiff);
        if (diff.gt(bignumber_1.BigNumber.from(0))) {
          throw new Error(
            `Not enough balance to convert from native to wrapped, missing: ${bignumber_1.BigNumber.from(
              diff
            )}`
          );
        }
      } else {
        const balance = yield this.checkTokenBalance(
          wrappedTokenAddress,
          txObject.from
        );
        const amountDiff = bignumber_1.BigNumber.from(amount);
        const balanceDiff = bignumber_1.BigNumber.from(balance.toString());
        const diff = amountDiff.sub(balanceDiff);
        if (diff.gt(bignumber_1.BigNumber.from(0))) {
          throw new Error(
            `Not enough balance to convert from wrapped to native, missing: ${bignumber_1.BigNumber.from(
              diff
            )}`
          );
        }
      }
      if (isFromNativeToWrap) {
        try {
          const data = yield WrappedTokenContractInstance.methods.deposit();
          return this.sendMethod(
            data,
            txObject.from,
            wrappedTokenAddress,
            amount
          );
        } catch (e) {
          throw new Error(`wrapToken: Failed to execute deposit on ${wrappedTokenAddress} with error:
                    ${JSON.stringify(e)}`);
        }
      } else {
        try {
          const data = yield WrappedTokenContractInstance.methods.withdraw(
            amount
          );
          return this.sendMethod(
            data,
            txObject.from,
            wrappedTokenAddress,
            undefined
          );
        } catch (e) {
          throw new Error(`wrapToken: failed to execute withdraw on ${wrappedTokenAddress} with error:
                    ${JSON.stringify(e)}`);
        }
      }
    });
  }
  /** Approve NFT Contract
   * @param {string} contractAddress nft contract to approve.
   * @param {TxObject} txObject transaction object to send when calling `approveContract`.
   * @param {string} proxyAddress contract to give approval to.
   */
  approveContract(contractAddress, txObject, proxyAddress) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(
        `approveContract: approve nft contract ${contractAddress} on ${this._chainFullName}`
      );
      if (this._isReadonlyProvider)
        throw new Error(`Can not sign transaction with a read only provider.`);
      const supportsERC721 = yield this._supportsERC721(contractAddress);
      const supportsERC155 = yield this._supportsERC1155(contractAddress);
      if (!supportsERC721 && !supportsERC155)
        throw new Error(
          `contract: ${contractAddress} does not support ERC721 or ERC1155`
        );
      const proxyContractAddress =
        proxyAddress !== null && proxyAddress !== void 0
          ? proxyAddress
          : this._getNFTProxyContractAddress(this._chainName);
      const ContractInstance = new this.web3.eth.Contract(
        abi_1.ERC721Contract,
        contractAddress
      );
      try {
        const data = yield ContractInstance.methods.setApprovalForAll(
          proxyContractAddress,
          true
        );
        return this.sendMethod(data, txObject.from, contractAddress, undefined);
      } catch (e) {
        throw new Error(
          `approveContract: failed to execute setApprovalForAll on ${contractAddress} with error: ${JSON.stringify(
            e
          )}`
        );
      }
    });
  }
  /** Approve Token Contract
   * @param {string} contractAddress token contract to approve.
   * @param {TxObject} txObject transaction object to send when calling `approveToken`.
   * @param {string} proxyAddress contract to give approval to - optional default to ghostmarket proxy.
   */
  approveToken(contractAddress, txObject, proxyAddress) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(
        `approveToken: approve token contract ${contractAddress} on ${this._chainFullName}`
      );
      if (this._isReadonlyProvider)
        throw new Error(`Can not sign transaction with a read only provider.`);
      const proxyContractAddress =
        proxyAddress !== null && proxyAddress !== void 0
          ? proxyAddress
          : this._getERC20ProxyContractAddress(this._chainName);
      const ContractInstance = new this.web3.eth.Contract(
        abi_1.ERC721Contract,
        contractAddress
      );
      try {
        const data = yield ContractInstance.methods.approve(
          proxyContractAddress,
          evm_1.MAX_UINT_256
        );
        return this.sendMethod(data, txObject.from, contractAddress, undefined);
      } catch (e) {
        throw new Error(
          `approveToken: failed to execute approve on ${contractAddress} with error: ${JSON.stringify(
            e
          )}`
        );
      }
    });
  }
  /** Check NFT Contract Approval
   * @param {string} contractAddress nft contract to check approval.
   * @param {string} accountAddress address used to check.
   * @param {string} proxyAddress contract which was given approval - optional default to ghostmarket proxy.
   */
  checkContractApproval(contractAddress, accountAddress, proxyAddress) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(
        `checkContractApproval: checking nft contract ${contractAddress} approval on ${this._chainFullName}`
      );
      const supportsERC721 = yield this._supportsERC721(contractAddress);
      const supportsERC1155 = yield this._supportsERC1155(contractAddress);
      if (!supportsERC721 && !supportsERC1155)
        throw new Error(
          `contract: ${contractAddress} does not support ERC721 or ERC1155`
        );
      const proxyContractAddress =
        proxyAddress !== null && proxyAddress !== void 0
          ? proxyAddress
          : this._getNFTProxyContractAddress(this._chainName);
      const ContractInstance = new this.web3.eth.Contract(
        abi_1.ERC721Contract,
        contractAddress
      );
      try {
        const data = yield ContractInstance.methods.isApprovedForAll(
          accountAddress,
          proxyContractAddress
        );
        return yield this.callMethod(data, accountAddress);
      } catch (e) {
        throw new Error(`checkContractApproval: failed to execute isApprovedForAll on ${contractAddress} with error: 
                ${JSON.stringify(e)}`);
      }
    });
  }
  /** Check ERC20 Token Contract Approval
   * @param {string} contractAddress token contract to check approval.
   * @param {string} accountAddress address used to check.
   * @param {string} proxyAddress contract which was given approval - optional default to ghostmarket proxy.
   */
  checkTokenApproval(contractAddress, accountAddress, proxyAddress) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(
        `checkTokenApproval: checking token contract ${contractAddress} approval for ${accountAddress} on ${this._chainFullName}`
      );
      const proxyContractAddress =
        proxyAddress !== null && proxyAddress !== void 0
          ? proxyAddress
          : this._getERC20ProxyContractAddress(this._chainName);
      const ERC20ContractInstance = new this.web3.eth.Contract(
        abi_1.ERC20WrappedContract,
        contractAddress
      );
      try {
        const data = yield ERC20ContractInstance.methods.allowance(
          accountAddress,
          proxyContractAddress
        );
        return yield this.callMethod(data, accountAddress);
      } catch (e) {
        throw new Error(
          `checkTokenApproval: failed to execute allowance on ${contractAddress} with error: ${JSON.stringify(
            e
          )}`
        );
      }
    });
  }
  /** Transfer ERC20
   * @param {string} destinationAddress destination address .
   * @param {string} contractAddress contract of token to transfer.
   * @param {string} amount amount to transfer.
   * @param {TxObject} txObject transaction object to send when calling `transferERC20`.
   */
  transferERC20(destinationAddress, contractAddress, amount, txObject) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(
        `transferERC20: transfer ${amount} from ERC20 contract ${contractAddress} to ${destinationAddress} on ${this._chainFullName}`
      );
      if (this._isReadonlyProvider)
        throw new Error(`Can not sign transaction with a read only provider.`);
      const balance = yield this.checkTokenBalance(
        contractAddress,
        txObject.from
      );
      const amountDiff = bignumber_1.BigNumber.from(amount);
      const balanceDiff = bignumber_1.BigNumber.from(balance.toString());
      const diff = amountDiff.sub(balanceDiff);
      if (diff.gt(bignumber_1.BigNumber.from(0))) {
        throw new Error(
          `not enough ERC20 balance to transfer, missing: ${bignumber_1.BigNumber.from(
            diff
          )}`
        );
      }
      const ContractInstance = new this.web3.eth.Contract(
        abi_1.ERC20Contract,
        contractAddress
      );
      try {
        const data = yield ContractInstance.methods.transfer(
          destinationAddress,
          amount
        );
        return this.sendMethod(data, txObject.from, contractAddress, undefined);
      } catch (e) {
        throw new Error(
          `transferERC20: failed to execute transfer on ${contractAddress} with error: ${JSON.stringify(
            e
          )}`
        );
      }
    });
  }
  /** Transfer ERC721 NFT
   * @param {string} destinationAddress destination address of NFT.
   * @param {string} contractAddress contract of NFT to transfer.
   * @param {string} tokenId token ID of NFT to transfer.
   * @param {TxObject} txObject transaction object to send when calling `transferERC721`.
   */
  transferERC721(destinationAddress, contractAddress, tokenId, txObject) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(
        `transferERC721: transfer NFT with token id ${tokenId} from ERC721 contract ${contractAddress} to ${destinationAddress} on ${this._chainFullName}`
      );
      if (this._isReadonlyProvider)
        throw new Error(`Can not sign transaction with a read only provider.`);
      const owner = yield this._ownerOf(contractAddress, tokenId);
      if (owner.toLowerCase() !== txObject.from.toLowerCase())
        throw new Error(
          `owner: ${owner} does not match tx.sender: ${txObject.from}`
        );
      const ContractInstance = new this.web3.eth.Contract(
        abi_1.ERC721Contract,
        contractAddress
      );
      try {
        const data = yield ContractInstance.methods.safeTransferFrom(
          txObject.from,
          destinationAddress,
          tokenId
        );
        return this.sendMethod(data, txObject.from, contractAddress, undefined);
      } catch (e) {
        throw new Error(
          `transferERC721: failed to execute safeTransferFrom on ${contractAddress} with error: ${JSON.stringify(
            e
          )}`
        );
      }
    });
  }
  /** Transfer Batch ERC1155 NFT
   * @param {string} destinationAddress destination address of transfer.
   * @param {string} contractAddress contract of NFT to transfer.
   * @param {string[]} tokenIds token ID of NFTs to transfer.
   * @param {string[]} amounts amount of NFTs to transfer.
   * @param {TxObject} txObject transaction object to send when calling `transferERC1155`.
   */
  transferERC1155(
    destinationAddress,
    contractAddress,
    tokenIds,
    amounts,
    txObject
  ) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(
        `transferERC1155: transfer ${tokenIds.length} NFT${
          tokenIds.length > 1 ? "s" : ""
        } from ERC1155 contract ${contractAddress} to ${destinationAddress} on ${
          this._chainFullName
        }`
      );
      if (this._isReadonlyProvider)
        throw new Error(`Can not sign transaction with a read only provider.`);
      for (let i = 0; i < tokenIds.length; i++) {
        const balance = yield this._balanceOf(
          txObject.from,
          contractAddress,
          tokenIds[i]
        );
        if (balance === 0)
          throw new Error(
            `sender: ${txObject.from} does not own enough tokenId ${tokenIds[i]}`
          );
      }
      const ContractInstance = new this.web3.eth.Contract(
        abi_1.ERC1155Contract,
        contractAddress
      );
      try {
        const data = yield ContractInstance.methods.safeBatchTransferFrom(
          txObject.from,
          destinationAddress,
          tokenIds,
          amounts,
          "0x"
        );
        return this.sendMethod(data, txObject.from, contractAddress, undefined);
      } catch (e) {
        throw new Error(
          `transferERC1155: failed to execute safeBatchTransferFrom on ${contractAddress} with error: ${JSON.stringify(
            e
          )}`
        );
      }
    });
  }
  /** Burn ERC721 NFT
   * @param {string} contractAddress contract of NFT to transfer.
   * @param {string} tokenId tokenId of NFT to transfer.
   * @param {TxObject} txObject transaction object to send when calling `burnERC721`.
   */
  burnERC721(contractAddress, tokenId, txObject) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(
        `burnERC721: burn 1 NFT from ERC721 contract ${contractAddress} with token id ${tokenId} on ${this._chainFullName}`
      );
      if (this._isReadonlyProvider)
        throw new Error(`Can not sign transaction with a read only provider.`);
      const owner = yield this._ownerOf(contractAddress, tokenId);
      if (owner.toLowerCase() !== txObject.from.toLowerCase())
        throw new Error(
          `owner: ${owner} does not match tx.sender: ${txObject.from}`
        );
      const ContractInstance = new this.web3.eth.Contract(
        abi_1.ERC721Contract,
        contractAddress
      );
      try {
        const data = yield ContractInstance.methods.burn(tokenId);
        return this.sendMethod(data, txObject.from, contractAddress, undefined);
      } catch (e) {
        throw new Error(
          `burnERC721: failed to execute burn on ${contractAddress} with error: ${JSON.stringify(
            e
          )}`
        );
      }
    });
  }
  /** Burn ERC1155 NFT
   * @param {string} contractAddress contract of NFT to transfer.
   * @param {string} tokenId token ID of NFTs to transfer.
   * @param {string} amount amount of NFTs to transfer.
   * @param {TxObject} txObject transaction object to send when calling `burnERC1155`.
   */
  burnERC1155(contractAddress, tokenId, amount, txObject) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(
        `burnERC1155: burn ${amount} NFT${
          amount > 1 ? "s" : ""
        } from ERC1155 contract ${contractAddress} with token id ${tokenId} on ${
          this._chainFullName
        }`
      );
      if (this._isReadonlyProvider)
        throw new Error(`Can not sign transaction with a read only provider.`);
      const balance = yield this._balanceOf(
        txObject.from,
        contractAddress,
        tokenId
      );
      if (balance === 0)
        throw new Error(
          `sender: ${txObject.from} does not own enough token ${tokenId}`
        );
      const ContractInstance = new this.web3.eth.Contract(
        abi_1.ERC1155Contract,
        contractAddress
      );
      try {
        const data = yield ContractInstance.methods.burn(
          txObject.from,
          tokenId,
          amount
        );
        return this.sendMethod(data, txObject.from, contractAddress, undefined);
      } catch (e) {
        throw new Error(
          `burnERC1155: failed to execute burn on ${contractAddress} with error: ${JSON.stringify(
            e
          )}`
        );
      }
    });
  }
  /** Mint ERC721 GHOST NFT
   * @param {IMintItem} item details.
   * @param {TxObject} txObject transaction object to send when calling `mintERC721`.
   */
  mintERC721(item, txObject) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(`mintERC721: mint 1 ERC721 NFT on ${this._chainFullName}`);
      if (this._isReadonlyProvider)
        throw new Error(`Can not sign transaction with a read only provider.`);
      const ERC721GhostAddress = this._getERC721GhostContractAddress(
        this._chainName
      );
      const ERC721GhostAddressInstance = new this.web3.eth.Contract(
        abi_1.ERC721Contract,
        ERC721GhostAddress
      );
      const contractRoyalties = [];
      if (item.royalties) {
        for (let i = 0; i < item.royalties.length; i++) {
          contractRoyalties.push([
            item.royalties[i].address,
            item.royalties[i].value.toString(),
          ]);
        }
      }
      console.log("START");
      try {
        const data = yield ERC721GhostAddressInstance.methods.mintGhost(
          item.creatorAddress,
          contractRoyalties,
          item.externalURI,
          "",
          ""
        ); // lock content & onchain metadata not available at the moment on SDK
        console.log("data from minting: ", data);
        return this.sendMethod(
          data,
          txObject.from,
          ERC721GhostAddress,
          undefined
        );
      } catch (e) {
        throw new Error(
          `mintERC721: failed to execute mintGhost on ${ERC721GhostAddress} with error: ${JSON.stringify(
            e
          )}`
        );
      }
    });
  }
  /** Mint ERC1155 GHOST NFT
   * @param {IMintItem} item details.
   * @param {number} amount amount of NFT to mint.
   * @param {TxObject} txObject transaction object to send when calling `mintERC1155`.
   */
  mintERC1155(item, amount, txObject) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(
        `mintERC1155: mint ${amount} ERC1155 NFT on ${this._chainFullName}`
      );
      if (this._isReadonlyProvider)
        throw new Error(`Can not sign transaction with a read only provider.`);
      const ERC1155GhostAddress = this._getERC1155GhostContractAddress(
        this._chainName
      );
      const ERC1155GhostAddressInstance = new this.web3.eth.Contract(
        abi_1.ERC1155Contract,
        ERC1155GhostAddress
      );
      const contractRoyalties = [];
      console.log("ERC1155GhostAddress", ERC1155GhostAddress);
      if (item.royalties) {
        for (let i = 0; i < item.royalties.length; i++) {
          contractRoyalties.push([
            item.royalties[i].address,
            item.royalties[i].value.toString(),
          ]);
        }
      }
      try {
        const data = yield ERC1155GhostAddressInstance.methods.mintGhost(
          item.creatorAddress,
          amount,
          [],
          contractRoyalties,
          item.externalURI,
          "",
          ""
        ); // data && lock content & onchain metadata not available at the moment on SDK
        console.log("data: ", data);
        return this.sendMethod(
          data,
          txObject.from,
          ERC1155GhostAddress,
          undefined
        );
      } catch (e) {
        throw new Error(
          `mintERC1155: failed to execute mintGhost on ${ERC1155GhostAddress} with error: ${JSON.stringify(
            e
          )}`
        );
      }
    });
  }
  /** Check native balance for address
   * @param {string} accountAddress address used to check.
   */
  checkBalance(accountAddress) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(
        `checkBalance: checking native balance for address ${accountAddress} on ${this._chainFullName}`
      );
      try {
        const data = yield this.web3.eth.getBalance(accountAddress);
        return data;
      } catch (e) {
        throw new Error(
          `checkBalance: failed to execute getBalance with error: ${JSON.stringify(
            e
          )}`
        );
      }
    });
  }
  /** Check one token balance for address
   * @param {string} contractAddress token contract to check approval.
   * @param {string} accountAddress address used to check.
   */
  checkTokenBalance(contractAddress, accountAddress) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(
        `checkTokenBalance: checking token balance for contract ${contractAddress} for address ${accountAddress} on ${this._chainFullName}`
      );
      const ERC20ContractInstance = new this.web3.eth.Contract(
        abi_1.ERC20WrappedContract,
        contractAddress
      );
      try {
        const data = yield ERC20ContractInstance.methods.balanceOf(
          accountAddress
        );
        return yield this.callMethod(data, accountAddress);
      } catch (e) {
        throw new Error(
          `checkTokenBalance: failed to execute balanceOf on ${contractAddress} with error: ${JSON.stringify(
            e
          )}`
        );
      }
    });
  }
  /** Check incentives for address
   * @param {string} accountAddress address used to check.
   */
  checkIncentives(accountAddress) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(
        `checkIncentives: checking incentives for address ${accountAddress} on ${this._chainFullName}`
      );
      const IncentivesContractAddress = this._getIncentivesContractAddress(
        this._chainName
      );
      const IncentivesContractInstance = new this.web3.eth.Contract(
        abi_1.IncentivesContract,
        IncentivesContractAddress
      );
      try {
        const data = yield IncentivesContractInstance.methods.incentives(
          accountAddress
        );
        return this.callMethod(data, accountAddress);
      } catch (e) {
        throw new Error(
          `checkIncentives: failed to execute incentives on ${IncentivesContractAddress} with error: ${JSON.stringify(
            e
          )}`
        );
      }
    });
  }
  /** Claim incentives
   * @param {TxObject} txObject transaction object to send when calling `claimIncentives`.
   */
  claimIncentives(txObject) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(
        `claimIncentives: claiming incentives for address ${txObject.from} on ${this._chainFullName}`
      );
      if (this._isReadonlyProvider)
        throw new Error(`Can not sign transaction with a read only provider.`);
      const balance = yield this.checkIncentives(txObject.from);
      if (parseInt(balance.availableIncentives) === 0) {
        throw new Error(`nothing to claim on incentives contract`);
      }
      const IncentivesContractAddress = this._getIncentivesContractAddress(
        this._chainName
      );
      const IncentivesContractInstance = new this.web3.eth.Contract(
        abi_1.IncentivesContract,
        IncentivesContractAddress
      );
      try {
        const data = yield IncentivesContractInstance.methods.claim();
        return this.sendMethod(
          data,
          txObject.from,
          IncentivesContractAddress,
          undefined
        );
      } catch (e) {
        throw new Error(
          `claimIncentives: failed to execute claim on ${IncentivesContractAddress} with error: ${JSON.stringify(
            e
          )}`
        );
      }
    });
  }
  /** Check stakes on LP staking contract for address
   * @param {string} accountAddress address used to check.
   */
  checkLPStakes(accountAddress) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(
        `checkLPStakes: checking LP stakes for address ${accountAddress} on ${this._chainFullName}`
      );
      const LPStakingContractAddress = this._getLPStakingContractAddress(
        this._chainName
      );
      const LPStakingContractInstance = new this.web3.eth.Contract(
        abi_1.LPStakingContract,
        LPStakingContractAddress
      );
      try {
        const data = yield LPStakingContractInstance.methods.userInfo(
          accountAddress
        );
        return this.callMethod(data, accountAddress);
      } catch (e) {
        throw new Error(
          `checkLPStakes: failed to execute userInfo on ${LPStakingContractAddress} with error: ${JSON.stringify(
            e
          )}`
        );
      }
    });
  }
  /** Check rewards on LP staking contract for address
   * @param {string} accountAddress address used to check.
   */
  checkLPRewards(accountAddress) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(
        `checkLPRewards: checking LP rewards for address ${accountAddress} on ${this._chainFullName}`
      );
      const LPStakingContractAddress = this._getLPStakingContractAddress(
        this._chainName
      );
      const LPStakingContractInstance = new this.web3.eth.Contract(
        abi_1.LPStakingContract,
        LPStakingContractAddress
      );
      try {
        const data =
          yield LPStakingContractInstance.methods.calculatePendingRewards(
            accountAddress
          );
        return this.callMethod(data, accountAddress);
      } catch (e) {
        throw new Error(
          `checkLPRewards: failed to execute calculatePendingRewards on ${LPStakingContractAddress} with error: ${JSON.stringify(
            e
          )}`
        );
      }
    });
  }
  /** Claim LP rewards on LP staking contract for address
   * @param {TxObject} txObject transaction object to send when calling `claimLPRewards`.
   */
  claimLPRewards(txObject) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(
        `claimLPRewards: claiming LP rewards for address ${txObject.from} on ${this._chainFullName}`
      );
      if (this._isReadonlyProvider)
        throw new Error(`Can not sign transaction with a read only provider.`);
      const balance = yield this.checkLPRewards(txObject.from);
      if (parseInt(balance) === 0) {
        throw new Error(`nothing to claim on LP staking contract`);
      }
      const LPStakingContractAddress = this._getLPStakingContractAddress(
        this._chainName
      );
      const LPStakingContractInstance = new this.web3.eth.Contract(
        abi_1.LPStakingContract,
        LPStakingContractAddress
      );
      try {
        const data = yield LPStakingContractInstance.methods.harvest();
        return this.sendMethod(
          data,
          txObject.from,
          LPStakingContractAddress,
          undefined
        );
      } catch (e) {
        throw new Error(
          `claimLPRewards: failed to execute harvest on ${LPStakingContractAddress} with error: ${JSON.stringify(
            e
          )}`
        );
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
      console.log(
        `stakeLPTokens: ${
          isStaking ? "" : "un"
        }staking LP token amount of ${amount} on ${this._chainFullName}`
      );
      if (this._isReadonlyProvider)
        throw new Error(`Can not sign transaction with a read only provider.`);
      const LPTokenContractAddress = this._getLPTokenContractAddress(
        this._chainName
      );
      const LPStakingContractAddress = this._getLPStakingContractAddress(
        this._chainName
      );
      const LPStakingContractInstance = new this.web3.eth.Contract(
        abi_1.LPStakingContract,
        LPStakingContractAddress
      );
      if (isStaking) {
        const balance = yield this.checkTokenBalance(
          LPTokenContractAddress,
          txObject.from
        );
        const amountDiff = bignumber_1.BigNumber.from(amount);
        const balanceDiff = bignumber_1.BigNumber.from(balance.toString());
        const diff = amountDiff.sub(balanceDiff);
        if (diff.gt(bignumber_1.BigNumber.from(0))) {
          throw new Error(
            `Not enough balance to stake LP tokens, missing: ${bignumber_1.BigNumber.from(
              diff
            )}`
          );
        }
      }
      if (isStaking) {
        try {
          const data = yield LPStakingContractInstance.methods.deposit();
          return this.sendMethod(
            data,
            txObject.from,
            LPStakingContractAddress,
            amount
          );
        } catch (e) {
          throw new Error(`stakeLPTokens: Failed to execute deposit on ${LPStakingContractAddress} with error:
                    ${e}`);
        }
      } else {
        try {
          const data = yield LPStakingContractInstance.methods.withdraw(amount);
          return this.sendMethod(
            data,
            txObject.from,
            LPStakingContractAddress,
            undefined
          );
        } catch (e) {
          throw new Error(`stakeLPTokens: failed to execute withdraw on ${LPStakingContractAddress} with error:
                    ${e}`);
        }
      }
    });
  }
  /** Sign Data
   * @param {string} dataToSign data to sign.
   * @param {string} accountAddress address used to sign data.
   */
  signData(dataToSign, accountAddress) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(
        `signData: signing data with address ${accountAddress} on ${this._chainFullName}`
      );
      try {
        const hash = this.web3.utils.sha3(dataToSign);
        const data = this.web3.eth.sign(hash, accountAddress);
        return data;
      } catch (e) {
        throw new Error(
          `signData: Failed to execute sign with error: ${JSON.stringify(e)}`
        );
      }
    });
  }
  /** Get LP token contract address
   * @param {string} chainName chain name to check.
   */
  _getLPTokenContractAddress(chainName) {
    return constants_1.AddressesByChain[chainName].LP_TOKEN;
  }
  /** Get LP staking contract address
   * @param {string} chainName chain name to check.
   */
  _getLPStakingContractAddress(chainName) {
    return constants_1.AddressesByChain[chainName].LP_STAKING;
  }
  /** Get Incentives contract address
   * @param {string} chainName chain name to check.
   */
  _getIncentivesContractAddress(chainName) {
    return constants_1.AddressesByChain[chainName].INCENTIVES;
  }
  /** Get ERC721 Ghost contract address
   * @param {string} chainName chain name to check.
   */
  _getERC721GhostContractAddress(chainName) {
    return constants_1.AddressesByChain[chainName].GHOST_ERC721;
  }
  /** Get ERC1155 Ghost contract address
   * @param {string} chainName chain name to check.
   */
  _getERC1155GhostContractAddress(chainName) {
    return constants_1.AddressesByChain[chainName].GHOST_ERC1155;
  }
  /** Get ERC20 Proxy contract address
   * @param {string} chainName chain name to check.
   */
  _getERC20ProxyContractAddress(chainName) {
    return constants_1.AddressesByChain[chainName].PROXY_ERC20;
  }
  /** Get NFT Proxy contract address
   * @param {string} chainName chain name to check.
   */
  _getNFTProxyContractAddress(chainName) {
    return constants_1.AddressesByChain[chainName].PROXY_NFT;
  }
  /** Get ExchangeV2 contract address
   * @param {string} chainName chain name to check.
   */
  _getExchangeV2ProxyContractAddress(chainName) {
    return constants_1.AddressesByChain[chainName].EXCHANGE;
  }
  /** Get Royalties contract address
   * @param {string} chainName chain name to check.
   */
  _getRoyaltiesRegistryContractAddress(chainName) {
    return constants_1.AddressesByChain[chainName].ROYALTIES;
  }
  /** Get Wrapped Token contract address
   * @param {string} chainName chain name to check.
   */
  _getWrappedTokenContractAddress(chainName) {
    return constants_1.AddressesByChain[chainName].WRAPPED_TOKEN;
  }
  /** Get chain support for EIP1559
   * @param {string} chainName chain name to check.
   */
  _supportsEIP1559(chainName) {
    switch (chainName) {
      case gm_api_js_1.ChainNetwork.Avalanche:
        return true;
      case gm_api_js_1.ChainNetwork.AvalancheT:
        return true;
      case gm_api_js_1.ChainNetwork.Eth:
        return true;
      case gm_api_js_1.ChainNetwork.EthT:
        return true;
      case gm_api_js_1.ChainNetwork.Bsc:
        return false;
      case gm_api_js_1.ChainNetwork.BscT:
        return false;
      case gm_api_js_1.ChainNetwork.Polygon:
        return true;
      case gm_api_js_1.ChainNetwork.PolygonT:
        return true;
      case gm_api_js_1.ChainNetwork.Base:
        return true;
      case gm_api_js_1.ChainNetwork.BaseT:
        return true;
      case gm_api_js_1.ChainNetwork.Shardeum:
        return false;
      case gm_api_js_1.ChainNetwork.ShardeumT:
        return false;
      case gm_api_js_1.ChainNetwork.NeoX:
        return false;
      case gm_api_js_1.ChainNetwork.NeoXT:
        return false;
      case gm_api_js_1.ChainNetwork.Blast:
        return true;
      case gm_api_js_1.ChainNetwork.BlastT:
        return true;
      default:
        return false;
    }
  }
  /** Get owner of a contract
   * @param {string} contractAddress contract address.
   * @param {boolean} isERC721 true for ERC721, false for ERC1155.
   */
  _getOwner(contractAddress, isERC721) {
    console.log(
      `_getOwner: checking ${
        isERC721 ? "ERC721" : "ERC1155"
      } contract ownership for contract ${contractAddress} on ${
        this._chainFullName
      }`
    );
    const ContractInstance = new this.web3.eth.Contract(
      isERC721 ? abi_1.ERC721Contract : abi_1.ERC1155Contract,
      contractAddress
    );
    return ContractInstance.methods
      .owner()
      .call()
      .then((res) => {
        return res;
      })
      .catch((_e) => {
        // console.log(e)
        return evm_1.NULL_ADDRESS_EVM;
      });
  }
  /** Get owner of an ERC721 NFT
   * @param {string} contractAddress contract address of NFT.
   * @param {string} tokenId tokenId of NFT.
   */
  _ownerOf(contractAddress, tokenId) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(
        `_ownerOf: checking ERC721 owner for contract ${contractAddress} for token id ${tokenId} on ${this._chainFullName}`
      );
      const supportsERC721 = yield this._supportsERC721(contractAddress);
      if (supportsERC721) {
        const NFTContractInstance = new this.web3.eth.Contract(
          abi_1.ERC721Contract,
          contractAddress
        );
        return NFTContractInstance.methods
          .ownerOf(tokenId)
          .call()
          .then((res) => {
            return res;
          })
          .catch((_e) => {
            // console.log(e)
            return evm_1.NULL_ADDRESS_EVM;
          });
      }
      return evm_1.NULL_ADDRESS_EVM;
    });
  }
  /** Get balance of one address for an ERC1155 NFT
   * @param {string} address addres to check.
   * @param {string} contractAddress contract address of NFT.
   * @param {string} tokenId tokenId of NFT.
   */
  _balanceOf(address, contractAddress, tokenId) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(
        `_balanceOf: checking ERC1155 balance for contract ${contractAddress} for address ${address} for token id ${tokenId} on ${this._chainFullName}`
      );
      const supportsERC1555 = yield this._supportsERC1155(contractAddress);
      if (supportsERC1555) {
        const NFTContractInstance = new this.web3.eth.Contract(
          abi_1.ERC1155Contract,
          contractAddress
        );
        return NFTContractInstance.methods
          .balanceOf(address, tokenId)
          .call()
          .then((res) => {
            return res;
          })
          .catch((_e) => {
            // console.log(e)
            return 0;
          });
      }
      return 0;
    });
  }
  /** Get contract support for ERC721
   * @param {string} contractAddress contract address to check.
   */
  _supportsERC721(contractAddress) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        console.log(
          `_supportsERC721: checking support for ERC721 for contract ${contractAddress} on ${this._chainFullName}`
        );
        const NFTContractInstance = new this.web3.eth.Contract(
          abi_1.ERC165Contract,
          contractAddress
        );
        return NFTContractInstance.methods
          .supportsInterface(evm_1.ERC721_INTERFACE_ID)
          .call()
          .then((res) => {
            return res;
          })
          .catch((_e) => {
            // console.log(e)
            return false;
          });
      } catch (err) {
        return false;
      }
    });
  }
  /** Get contract support for ERC1155
   * @param {string} contractAddress contract address to check.
   */
  _supportsERC1155(contractAddress) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        console.log(
          `_supportsERC1155: checking support for ERC1155 for contract ${contractAddress} on ${this._chainFullName}`
        );
        const NFTContractInstance = new this.web3.eth.Contract(
          abi_1.ERC165Contract,
          contractAddress
        );
        return NFTContractInstance.methods
          .supportsInterface(evm_1.ERC1155_INTERFACE_ID)
          .call()
          .then((res) => {
            return res;
          })
          .catch((_e) => {
            // console.log(e)
            return false;
          });
      } catch (err) {
        return false;
      }
    });
  }
  sendMethod(dataOrMethod, from, _to, value) {
    const type = this._supportsEIP1559(this._chainName) ? "0x2" : "";
    return new Promise((resolve, reject) =>
      dataOrMethod
        .send({ from, value, type })
        // .then((res:any) => resolve(res.transactionHash)) // unused as this would mean waiting for the tx to be included in a block
        .on("transactionHash", (hash) => resolve(hash)) // returns hash instantly
        .catch((err) => reject(err))
    );
  }
  callMethod(dataOrMethod, from) {
    return new Promise((resolve, reject) =>
      dataOrMethod
        .call({ from })
        .then((res) => resolve(res))
        .catch((err) => reject(err))
    );
  }
}
exports.GhostMarketSDK = GhostMarketSDK;
//# sourceMappingURL=sdk.evm.js.map
