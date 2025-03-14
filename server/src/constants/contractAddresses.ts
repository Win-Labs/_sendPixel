import { Address } from "viem";
import chains from "./chains";

const { localhost, holesky, sepolia, baseSepolia } = chains;

interface CanvasDeployers {
  [chainId: number]: Address; // Keys are numbers (chain IDs), values are addresses (strings)
}

const CANVAS_DEPLOYERS: CanvasDeployers = {
  [localhost.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [holesky.id]: "0x625eBBBcB0d13a241BF2E8a6a773462193Fa0f4d",
  [sepolia.id]: "0xE53bBe636435402a77a485098a43797894156dA4",
  [baseSepolia.id]: "0x155bc4207709a0a7bfbddd47c260b3f40afd464c",
};

export { CANVAS_DEPLOYERS };
