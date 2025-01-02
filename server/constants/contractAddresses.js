import {
  localhost,
  holesky,
  sepolia,
  celoAlfajores,
  baseSepolia,
  lineaSepolia,
  scrollSepolia,
  neoXT4,
} from "./chains.js";

const CANVAS_DEPLOYERS = {
  [localhost.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [holesky.id]: "0x625eBBBcB0d13a241BF2E8a6a773462193Fa0f4d",
  [sepolia.id]: "0xE53bBe636435402a77a485098a43797894156dA4",
  [celoAlfajores.id]: "0x2CdD0E57D3609Dc93047794409Ab2f9aAAfA4E4D",
  [baseSepolia.id]: "0x155bc4207709a0a7bfbddd47c260b3f40afd464c",
  [lineaSepolia.id]: "0x2CdD0E57D3609Dc93047794409Ab2f9aAAfA4E4D",
  [scrollSepolia.id]: "0x2CdD0E57D3609Dc93047794409Ab2f9aAAfA4E4D",
  [neoXT4.id]: "0xe43fb80c422156180a0eb457d47c40f0c05546e1",
};

export { CANVAS_DEPLOYERS };
