/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  ICrowdFunding,
  ICrowdFundingInterface,
} from "../../../contracts/interfaces/ICrowdFunding";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_rewardOwner",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "_vestingIndex",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_tokenSource",
        type: "address",
      },
    ],
    name: "activateInvestorVesting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_rewardOwners",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_advancePayments",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_amountsPerVesting",
        type: "uint256[]",
      },
      {
        internalType: "uint8[]",
        name: "_numberOfVestings",
        type: "uint8[]",
      },
      {
        internalType: "uint256",
        name: "_releaseDate",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_tokenHolder",
        type: "address",
      },
    ],
    name: "addRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_rewardOwner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_tokenReceiver",
        type: "address",
      },
    ],
    name: "addToBlacklist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_vestingIndex",
        type: "uint8",
      },
    ],
    name: "claimTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_rewardOwner",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "_vestingIndex",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_tokenReceiver",
        type: "address",
      },
    ],
    name: "deactivateInvestorVesting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_vestingIndex",
        type: "uint8",
      },
    ],
    name: "fetchRewardsInfo",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "releaseDate",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isClaimed",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
        ],
        internalType: "struct TokenReward",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_rewardOwner",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "_vestingIndex",
        type: "uint8",
      },
    ],
    name: "fetchRewardsInfoForAccount",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "releaseDate",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isClaimed",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
        ],
        internalType: "struct TokenReward",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_time",
        type: "uint256",
      },
    ],
    name: "isInBlacklist",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_rewardOwner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_tokenSource",
        type: "address",
      },
    ],
    name: "removeFromBlacklist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class ICrowdFunding__factory {
  static readonly abi = _abi;
  static createInterface(): ICrowdFundingInterface {
    return new utils.Interface(_abi) as ICrowdFundingInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ICrowdFunding {
    return new Contract(address, _abi, signerOrProvider) as ICrowdFunding;
  }
}
