"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAINNET_API_URL = exports.TESTNET_API_URL = exports.ChainNetwork = exports.GhostMarketN3SDK = exports.GhostMarketSDK = exports.GhostMarketApi = void 0;
const sdk_evm_1 = require("./core/sdk.evm");
Object.defineProperty(exports, "GhostMarketSDK", { enumerable: true, get: function () { return sdk_evm_1.GhostMarketSDK; } });
const sdk_n3_1 = require("./core/sdk.n3");
Object.defineProperty(exports, "GhostMarketN3SDK", { enumerable: true, get: function () { return sdk_n3_1.GhostMarketN3SDK; } });
// import { GhostMarketPHASDK } from './core/sdk.pha'
const gm_api_js_1 = require("@onblockio/gm-api-js");
Object.defineProperty(exports, "ChainNetwork", { enumerable: true, get: function () { return gm_api_js_1.ChainNetwork; } });
Object.defineProperty(exports, "GhostMarketApi", { enumerable: true, get: function () { return gm_api_js_1.GhostMarketApi; } });
const constants_1 = require("./core/constants");
Object.defineProperty(exports, "TESTNET_API_URL", { enumerable: true, get: function () { return constants_1.TESTNET_API_URL; } });
Object.defineProperty(exports, "MAINNET_API_URL", { enumerable: true, get: function () { return constants_1.MAINNET_API_URL; } });
//# sourceMappingURL=index.js.map