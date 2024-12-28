"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYOUT = exports.ORIGIN = exports.ROYALTY = exports.PROTOCOL = exports.TO_TAKER = exports.TO_MAKER = exports.ORDER_DATA_V2 = exports.ORDER_DATA_V1 = exports.COLLECTION = exports.ERC1155 = exports.ERC721 = exports.ERC20 = exports.ETH = void 0;
const web3_1 = __importDefault(require("web3"));
const Web3 = new web3_1.default();
function id(str) {
    const hex = `${Web3.utils
        .keccak256(str)
        .toString()
        .substring(0, 2 + 8)}`;
    return hex;
}
// asset types that can be transfered
exports.ETH = id('ETH');
exports.ERC20 = id('ERC20');
exports.ERC721 = id('ERC721');
exports.ERC1155 = id('ERC1155');
exports.COLLECTION = id('COLLECTION');
// order types
exports.ORDER_DATA_V1 = id('V1');
exports.ORDER_DATA_V2 = id('V2');
// used as a variable for emitting event, transferDirection
exports.TO_MAKER = id('TO_MAKER');
// used as a variable for emitting event, transferDirection
exports.TO_TAKER = id('TO_TAKER');
// used as a variable for emitting event, transferType
exports.PROTOCOL = id('PROTOCOL');
// used as a variable for emitting event, transferType
exports.ROYALTY = id('ROYALTY');
// used as a variable for emitting event, transferType
exports.ORIGIN = id('ORIGIN');
// used as a variable for emitting event, transferType
exports.PAYOUT = id('PAYOUT');
//# sourceMappingURL=assets.js.map