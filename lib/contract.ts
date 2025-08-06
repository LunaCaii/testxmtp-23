// 这是您部署的 ChatDApp 合约的地址
export const chatDAppAddress = "0xF52f274Ef8ae77b0d241C7d5BfE25044A586A290" as const

// 这是您提供的 ChatDApp 合约的完整 ABI
export const chatDAppABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: true,
        internalType: "address",
        name: "newFriend",
        type: "address",
      },
    ],
    name: "FriendAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "string",
        name: "nickname",
        type: "string",
      },
    ],
    name: "UserRegistered",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "_friendAddress", type: "address" }],
    name: "addFriend",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "areFriends",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "friends",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getFriends",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "isUserRegistered",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "profiles",
    outputs: [
      { internalType: "address", name: "userAddress", type: "address" },
      { internalType: "string", name: "nickname", type: "string" },
      { internalType: "string", name: "avatarUrl", type: "string" },
      { internalType: "bool", name: "isRegistered", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_nickname", type: "string" },
      { internalType: "string", name: "_avatarUrl", type: "string" },
    ],
    name: "register",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const
