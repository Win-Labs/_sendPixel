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
const DOMAIN_TYPE = [
    {
        type: 'string',
        name: 'name',
    },
    {
        type: 'string',
        name: 'version',
    },
    {
        type: 'uint256',
        name: 'chainId',
    },
    {
        type: 'address',
        name: 'verifyingContract',
    },
];
exports.default = {
    createTypeData(domainData, primaryType, message, types) {
        return {
            types: Object.assign({
                EIP712Domain: DOMAIN_TYPE,
            }, types),
            domain: domainData,
            primaryType: primaryType,
            message: message,
        };
    },
    signTypedData(from, data, provider) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            function cb(err, result) {
                if (err) {
                    return reject(err);
                }
                if (result.error) {
                    return reject(result.error);
                }
                const sig = result.result;
                const sig0 = sig.substring(2);
                const r = '0x' + sig0.substring(0, 64);
                const s = '0x' + sig0.substring(64, 128);
                const v = parseInt(sig0.substring(128, 130), 16);
                resolve({
                    data,
                    sig,
                    v,
                    r,
                    s,
                });
            }
            if (provider.currentProvider.isMetaMask || provider.currentProvider.engine) {
                provider.currentProvider.sendAsync({
                    jsonrpc: '2.0',
                    method: 'eth_signTypedData_v3',
                    params: [from, JSON.stringify(data)],
                    id: new Date().getTime(),
                }, cb);
            }
            else {
                let send = provider.currentProvider.sendAsync;
                if (!send)
                    send = provider.currentProvider.send;
                send.bind(provider.currentProvider)({
                    jsonrpc: '2.0',
                    method: 'eth_signTypedData',
                    params: [from, data],
                    id: new Date().getTime(),
                }, cb);
            }
        }));
    },
};
//# sourceMappingURL=EIP712.js.map