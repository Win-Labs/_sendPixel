"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGhostMarketLink = void 0;
const constants_1 = require("../core/constants");
function getGhostMarketLink(asset, isMainNet = true) {
    const chain = asset.contract.chain;
    const contract = asset.contract.hash;
    const tokenId = asset.nftId;
    if (isMainNet)
        return `${constants_1.SITE_HOST_MAINNET}/${chain}/${contract}/${tokenId}`;
    return `${constants_1.SITE_HOST_TESTNET}/${chain}/${contract}/${tokenId}`;
}
exports.getGhostMarketLink = getGhostMarketLink;
//# sourceMappingURL=helpers.js.map