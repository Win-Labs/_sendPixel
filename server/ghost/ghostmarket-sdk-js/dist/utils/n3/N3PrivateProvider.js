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
exports.N3PrivateProvider = void 0;
const neon_core_1 = require("@cityofzion/neon-core");
class N3PrivateProvider {
    constructor(rpcUrl, pk, isMainNet) {
        this.account = new neon_core_1.wallet.Account(pk);
        this.rpcClient = new neon_core_1.rpc.RPCClient(rpcUrl
            ? rpcUrl
            : isMainNet
                ? 'https://mainnet1.neo.coz.io:443/'
                : 'https://testnet1.neo.coz.io:443/');
        this.isMainNet = isMainNet ? isMainNet : false;
    }
    convertArgs(args) {
        if (!args)
            return [];
        return args.map(a => {
            if (a.type == 'Hash160')
                return neon_core_1.sc.ContractParam.hash160(a.value);
            if (a.type == 'ByteArray')
                return neon_core_1.sc.ContractParam.byteArray(a.value);
            if (a.type == 'Integer')
                return neon_core_1.sc.ContractParam.integer(a.value);
            if (a.type == 'Array')
                return neon_core_1.sc.ContractParam.array(...a.value.map(v => {
                    const r = { type: v.type, value: v.value };
                    return r;
                }));
            return neon_core_1.sc.ContractParam.any(a.value);
        });
    }
    invoke(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const scArgs = this.convertArgs(params.args);
            const script = neon_core_1.sc.createScript({
                scriptHash: params.scriptHash,
                operation: params.operation,
                args: scArgs,
            });
            const inputs = {
                signers: params.signers,
                script: script,
                networkFee: params.networkFee ? parseFloat(params.networkFee) * Math.pow(10, 8) : 0,
                systemFee: params.networkFee ? parseFloat(params.networkFee) * Math.pow(10, 8) : 0,
            };
            return this.createTransaction(inputs);
        });
    }
    invokeMultiple(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const script = neon_core_1.sc.createScript(...params.invokeArgs.map(i => {
                return {
                    scriptHash: i.scriptHash,
                    operation: i.operation,
                    args: this.convertArgs(i.args),
                };
            }));
            const inputs = {
                signers: params.signers,
                script: script,
                networkFee: params.networkFee ? parseFloat(params.networkFee) * Math.pow(10, 8) : 0,
                systemFee: params.networkFee ? parseFloat(params.networkFee) * Math.pow(10, 8) : 0,
            };
            return this.createTransaction(inputs);
        });
    }
    invokeRead(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const scArgs = this.convertArgs(params.args);
            const result = yield this.rpcClient.invokeFunction(params.scriptHash, params.operation, scArgs, params.signers);
            return result;
        });
    }
    createTransaction(inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            // Retreive the current block height to calculate expiry
            const currentHeight = yield this.rpcClient.getBlockCount();
            const txn = new neon_core_1.tx.Transaction({
                signers: inputs.signers,
                validUntilBlock: currentHeight + 1000,
                script: inputs.script,
            });
            console.log('\u001b[32m  ✓ Transaction created \u001b[0m');
            // calculate network fee
            try {
                const feePerByteInvokeResponse = yield this.rpcClient.invokeFunction(neon_core_1.CONST.NATIVE_CONTRACT_HASH.PolicyContract, 'getFeePerByte');
                if (feePerByteInvokeResponse.state !== 'HALT') {
                    if (inputs.networkFee === 0) {
                        throw new Error('Unable to retrieve data to calculate network fee.');
                    }
                    else {
                        console.log('\u001b[31m  ✗ Unable to get information to calculate network fee.  Using user provided value.\u001b[0m');
                        txn.networkFee = neon_core_1.u.BigInteger.fromNumber(inputs.networkFee);
                    }
                }
                const feePerByte = neon_core_1.u.BigInteger.fromNumber(feePerByteInvokeResponse.stack[0].value);
                // Account for witness size
                const transactionByteSize = txn.serialize().length / 2 + 109;
                // Hardcoded. Running a witness is always the same cost for the basic account.
                const witnessProcessingFee = neon_core_1.u.BigInteger.fromNumber(1000390);
                const networkFeeEstimate = feePerByte.mul(transactionByteSize).add(witnessProcessingFee);
                if (inputs.networkFee && inputs.networkFee >= networkFeeEstimate) {
                    txn.networkFee = neon_core_1.u.BigInteger.fromNumber(inputs.networkFee);
                    console.log(`  i Node indicates ${networkFeeEstimate.toDecimal(8)} networkFee but using user provided value of ${inputs.networkFee / Math.pow(10, 8)}`);
                }
                else {
                    txn.networkFee = networkFeeEstimate;
                }
            }
            catch (e) {
                console.log(e);
                throw new Error(`Network fee calculation error: ${e}`);
            }
            console.log(`\u001b[32m  ✓ Network Fee set: ${txn.networkFee.toDecimal(8)} \u001b[0m`);
            // calculate system fee
            try {
                const invokeFunctionResponse = yield this.rpcClient.invokeScript(neon_core_1.u.HexString.fromHex(txn.script), inputs.signers);
                if (invokeFunctionResponse.state !== 'HALT') {
                    throw new Error(`Transfer script errored out: ${invokeFunctionResponse.exception}`);
                }
                const requiredSystemFee = neon_core_1.u.BigInteger.fromNumber(invokeFunctionResponse.gasconsumed);
                if (inputs.systemFee && inputs.systemFee >= requiredSystemFee) {
                    txn.systemFee = neon_core_1.u.BigInteger.fromNumber(inputs.systemFee);
                    console.log(`  i Node indicates ${requiredSystemFee.toDecimal(8)} systemFee but using user provided value of ${inputs.systemFee / Math.pow(10, 8)}`);
                }
                else {
                    txn.systemFee = requiredSystemFee;
                }
            }
            catch (e) {
                console.log(e);
                throw new Error(`System fee calculation error: ${e}`);
            }
            console.log(`\u001b[32m  ✓ System Fee set: ${txn.systemFee.toDecimal(8)}\u001b[0m`);
            // sign transaction
            const signedTransaction = txn.sign(this.account, neon_core_1.CONST.MAGIC_NUMBER[this.isMainNet ? 'MainNet' : 'TestNet']);
            // send transaction
            try {
                const result = yield this.rpcClient.sendRawTransaction(neon_core_1.u.HexString.fromHex(signedTransaction.serialize(true)));
                const txhash = {
                    txid: result,
                };
                return txhash;
            }
            catch (e) {
                console.log(e);
                throw new Error(`Send transaction error: ${e}`);
            }
        });
    }
}
exports.N3PrivateProvider = N3PrivateProvider;
//# sourceMappingURL=N3PrivateProvider.js.map