"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.b64EncodeUnicode = exports.numberToByteString = exports.getScriptHashFromAddress = exports.reverseHex = exports.ab2hexstring = void 0;
const bs58_1 = __importDefault(require("bs58"));
const bignumber_1 = require("@ethersproject/bignumber");
function ab2hexstring(arr) {
    if (typeof arr !== 'object') {
        throw new TypeError(`ab2hexstring expects an array. Input was ${arr}`);
    }
    let result = '';
    const intArray = new Uint8Array(arr);
    for (const i of intArray) {
        let str = i.toString(16);
        str = str.length === 0 ? '00' : str.length === 1 ? '0' + str : str;
        result += str;
    }
    return result;
}
exports.ab2hexstring = ab2hexstring;
function reverseHex(hex) {
    let out = '';
    for (let i = hex.length - 2; i >= 0; i -= 2) {
        out += hex.substr(i, 2);
    }
    return out;
}
exports.reverseHex = reverseHex;
function getScriptHashFromAddress(address) {
    const hash = ab2hexstring(bs58_1.default.decode(address));
    return reverseHex(hash.substr(2, 40));
}
exports.getScriptHashFromAddress = getScriptHashFromAddress;
function numberToByteString(num) {
    const h = bignumber_1.BigNumber.from(num).toHexString().substr(2);
    let hex = h.length % 2 ? '0' + h : h;
    const fc = hex.charAt(0);
    if ((fc > '7' && fc <= '9') || (fc >= 'a' && fc <= 'f')) {
        hex = '00' + hex;
    }
    return btoa(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    hex
        .match(/.{1,2}/g)
        .reverse()
        .map((v) => String.fromCharCode(parseInt(v, 16)))
        .join(''));
}
exports.numberToByteString = numberToByteString;
function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(_match, p1) {
        return String.fromCharCode(parseInt('0x' + p1));
    }));
}
exports.b64EncodeUnicode = b64EncodeUnicode;
//# sourceMappingURL=helpers.js.map