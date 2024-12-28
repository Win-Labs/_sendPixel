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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = exports.Order = exports.Asset = exports.AssetType = exports.enc = void 0;
const EIP712_1 = __importDefault(require("./EIP712"));
const web3_1 = __importDefault(require("web3"));
const Web3 = new web3_1.default();
function enc(token, tokenId) {
    if (tokenId) {
        return Web3.eth.abi.encodeParameters(['address', 'uint256'], [token, tokenId]);
    }
    else if (token === '0x') {
        return '0x';
    }
    else {
        return Web3.eth.abi.encodeParameter('address', token);
    }
}
exports.enc = enc;
function AssetType(assetClass, data) {
    return { assetClass, data };
}
exports.AssetType = AssetType;
function Asset(assetClass, assetData, value) {
    return { assetType: AssetType(assetClass, assetData), value };
}
exports.Asset = Asset;
function Order(maker, makeAsset, taker, takeAsset, salt, start, end, dataType, data) {
    return { maker, makeAsset, taker, takeAsset, salt, start, end, dataType, data };
}
exports.Order = Order;
const Types = {
    AssetType: [
        { name: 'assetClass', type: 'bytes4' },
        { name: 'data', type: 'bytes' },
    ],
    Asset: [
        { name: 'assetType', type: 'AssetType' },
        { name: 'value', type: 'uint256' },
    ],
    Order: [
        { name: 'maker', type: 'address' },
        { name: 'makeAsset', type: 'Asset' },
        { name: 'taker', type: 'address' },
        { name: 'takeAsset', type: 'Asset' },
        { name: 'salt', type: 'uint256' },
        { name: 'start', type: 'uint256' },
        { name: 'end', type: 'uint256' },
        { name: 'dataType', type: 'bytes4' },
        { name: 'data', type: 'bytes' },
    ],
};
function sign(order, account, verifyingContract, provider, chainId) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = EIP712_1.default.createTypeData({
            name: 'GhostMarket',
            version: '2',
            chainId,
            verifyingContract,
        }, 'Order', order, Types);
        return (yield EIP712_1.default.signTypedData(account, data, provider)).sig;
    });
}
exports.sign = sign;
//# sourceMappingURL=order.js.map