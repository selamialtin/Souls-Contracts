/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IAirdropVault,
  IAirdropVaultInterface,
} from "../../../contracts/interfaces/IAirdropVault";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_airdropContractAddress",
        type: "address",
      },
    ],
    name: "approveToAirdropContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_totalAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_initialRelease",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_lockDurationInDays",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_countOfVesting",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_releaseFrequencyInDays",
        type: "uint256",
      },
    ],
    name: "lockTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_receivers",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_amounts",
        type: "uint256[]",
      },
    ],
    name: "withdrawTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IAirdropVault__factory {
  static readonly abi = _abi;
  static createInterface(): IAirdropVaultInterface {
    return new utils.Interface(_abi) as IAirdropVaultInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IAirdropVault {
    return new Contract(address, _abi, signerOrProvider) as IAirdropVault;
  }
}
