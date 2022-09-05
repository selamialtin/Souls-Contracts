/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export interface AirdropInterface extends utils.Interface {
  functions: {
    "airdropRecordCount()": FunctionFragment;
    "airdropRecords(uint256)": FunctionFragment;
    "claimRecords(uint256,address)": FunctionFragment;
    "claimTokens(uint256,bytes32[])": FunctionFragment;
    "createNewAirdrop(bytes32,uint256,uint256,uint256)": FunctionFragment;
    "soulsTokenAddress()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "airdropRecordCount"
      | "airdropRecords"
      | "claimRecords"
      | "claimTokens"
      | "createNewAirdrop"
      | "soulsTokenAddress"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "airdropRecordCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "airdropRecords",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "claimRecords",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "claimTokens",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "createNewAirdrop",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "soulsTokenAddress",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "airdropRecordCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "airdropRecords",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "claimRecords",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "claimTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createNewAirdrop",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "soulsTokenAddress",
    data: BytesLike
  ): Result;

  events: {};
}

export interface Airdrop extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: AirdropInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    airdropRecordCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    airdropRecords(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, BigNumber, BigNumber] & {
        merkleRootHash: string;
        totalAmount: BigNumber;
        startTime: BigNumber;
        endTime: BigNumber;
      }
    >;

    claimRecords(
      arg0: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    claimTokens(
      _amount: PromiseOrValue<BigNumberish>,
      _merkleProof: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    createNewAirdrop(
      _merkleRootHash: PromiseOrValue<BytesLike>,
      _totalAmount: PromiseOrValue<BigNumberish>,
      _startTime: PromiseOrValue<BigNumberish>,
      _endTime: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    soulsTokenAddress(overrides?: CallOverrides): Promise<[string]>;
  };

  airdropRecordCount(overrides?: CallOverrides): Promise<BigNumber>;

  airdropRecords(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [string, BigNumber, BigNumber, BigNumber] & {
      merkleRootHash: string;
      totalAmount: BigNumber;
      startTime: BigNumber;
      endTime: BigNumber;
    }
  >;

  claimRecords(
    arg0: PromiseOrValue<BigNumberish>,
    arg1: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  claimTokens(
    _amount: PromiseOrValue<BigNumberish>,
    _merkleProof: PromiseOrValue<BytesLike>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  createNewAirdrop(
    _merkleRootHash: PromiseOrValue<BytesLike>,
    _totalAmount: PromiseOrValue<BigNumberish>,
    _startTime: PromiseOrValue<BigNumberish>,
    _endTime: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  soulsTokenAddress(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    airdropRecordCount(overrides?: CallOverrides): Promise<BigNumber>;

    airdropRecords(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, BigNumber, BigNumber] & {
        merkleRootHash: string;
        totalAmount: BigNumber;
        startTime: BigNumber;
        endTime: BigNumber;
      }
    >;

    claimRecords(
      arg0: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    claimTokens(
      _amount: PromiseOrValue<BigNumberish>,
      _merkleProof: PromiseOrValue<BytesLike>[],
      overrides?: CallOverrides
    ): Promise<void>;

    createNewAirdrop(
      _merkleRootHash: PromiseOrValue<BytesLike>,
      _totalAmount: PromiseOrValue<BigNumberish>,
      _startTime: PromiseOrValue<BigNumberish>,
      _endTime: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    soulsTokenAddress(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    airdropRecordCount(overrides?: CallOverrides): Promise<BigNumber>;

    airdropRecords(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    claimRecords(
      arg0: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    claimTokens(
      _amount: PromiseOrValue<BigNumberish>,
      _merkleProof: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    createNewAirdrop(
      _merkleRootHash: PromiseOrValue<BytesLike>,
      _totalAmount: PromiseOrValue<BigNumberish>,
      _startTime: PromiseOrValue<BigNumberish>,
      _endTime: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    soulsTokenAddress(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    airdropRecordCount(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    airdropRecords(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    claimRecords(
      arg0: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    claimTokens(
      _amount: PromiseOrValue<BigNumberish>,
      _merkleProof: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    createNewAirdrop(
      _merkleRootHash: PromiseOrValue<BytesLike>,
      _totalAmount: PromiseOrValue<BigNumberish>,
      _startTime: PromiseOrValue<BigNumberish>,
      _endTime: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    soulsTokenAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}