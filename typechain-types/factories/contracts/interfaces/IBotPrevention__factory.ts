/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IBotPrevention,
  IBotPreventionInterface,
} from "../../../contracts/interfaces/IBotPrevention";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "afterTokenTransfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "beforeTokenTransfer",
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
        name: "_pairAddress",
        type: "address",
      },
    ],
    name: "setDexPairAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IBotPrevention__factory {
  static readonly abi = _abi;
  static createInterface(): IBotPreventionInterface {
    return new utils.Interface(_abi) as IBotPreventionInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IBotPrevention {
    return new Contract(address, _abi, signerOrProvider) as IBotPrevention;
  }
}
