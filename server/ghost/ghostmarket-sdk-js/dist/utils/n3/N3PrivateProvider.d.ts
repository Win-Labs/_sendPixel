import { rpc, wallet } from '@cityofzion/neon-core';
export interface Invocation {
    scriptHash: string;
    operation: string;
    args?: Argument[];
}
export interface Argument {
    type: string;
    value: any;
}
export interface Signer {
    account: string;
    scopes: string;
    allowedContracts?: string[];
    allowedGroups?: string[];
}
export declare class N3PrivateProvider {
    rpcClient: rpc.RPCClient;
    account: wallet.Account;
    isMainNet: boolean;
    constructor(rpcUrl: string, pk: string, isMainNet: boolean);
    private convertArgs;
    invoke(params: {
        scriptHash: string;
        operation: string;
        args?: Argument[];
        signers?: Signer[];
        networkFee?: string;
        systemFee?: string;
    }): Promise<any>;
    invokeMultiple(params: {
        invokeArgs: Invocation[];
        signers?: Signer[];
        networkFee?: string;
        systemFee?: string;
    }): Promise<any>;
    invokeRead(params: {
        scriptHash: string;
        operation: string;
        args?: Argument[];
        signers?: Signer[];
    }): Promise<any>;
    createTransaction(inputs: any): Promise<any>;
}
