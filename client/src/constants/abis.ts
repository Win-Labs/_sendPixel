const CANVAS_ABI = [
  {
    type: "constructor",
    inputs: [
      { name: "_activeDuration", type: "uint256", internalType: "uint256" },
      { name: "_walletAddress", type: "address", internalType: "address" },
    ],
    stateMutability: "nonpayable",
  },
  { type: "receive", stateMutability: "payable" },
  {
    type: "function",
    name: "activeDuration",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "batchSend",
    inputs: [{ name: "amounts", type: "uint256[]", internalType: "uint256[]" }],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "creationTime",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isActive",
    inputs: [],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "walletAddress",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "CanvasLocked",
    inputs: [{ name: "contractAddress", type: "address", indexed: false, internalType: "address" }],
    anonymous: false,
  },
  {
    type: "event",
    name: "PixelRegistered",
    inputs: [
      { name: "amount", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "sender", type: "address", indexed: false, internalType: "address" },
      { name: "contractAddress", type: "address", indexed: false, internalType: "address" },
    ],
    anonymous: false,
  },
];

const CANVAS_DEPLOYER_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "deployer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "deployedCanvasContract",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "height",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "width",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "mode",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "activeDuration",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "creationTime",
        type: "uint256",
      },
    ],
    name: "CanvasDeployed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_height",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_width",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_mode",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_activeDuration",
        type: "uint256",
      },
    ],
    name: "deployCanvas",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "walletAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export { CANVAS_ABI, CANVAS_DEPLOYER_ABI };
