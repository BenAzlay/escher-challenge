export const abi = [
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "uint256", name: "_favoriteNumber", type: "uint256" }
    ],
    name: "addPerson",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "string", name: "", type: "string" }
    ],
    name: "nameToFavoriteNumber",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    name: "people",
    outputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "uint256", name: "favoriteNumber", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "removeLastPerson",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "retrieve",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_favoriteNumber", type: "uint256" }
    ],
    name: "store",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const;
