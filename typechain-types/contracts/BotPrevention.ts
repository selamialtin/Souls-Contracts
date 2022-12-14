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
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export interface BotPreventionInterface extends utils.Interface {
  functions: {
    "afterTokenTransfer(address,address,uint256)": FunctionFragment;
    "beforeTokenTransfer(address,address,uint256)": FunctionFragment;
    "botPreventionDuration()": FunctionFragment;
    "botProtectionParams()": FunctionFragment;
    "dexPairAddress()": FunctionFragment;
    "disableTrading()": FunctionFragment;
    "enableTrading(uint256,uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setDexPairAddress(address)": FunctionFragment;
    "setManagersAddress(address)": FunctionFragment;
    "setTokenAddress(address)": FunctionFragment;
    "tokenAddress()": FunctionFragment;
    "tradingEnabled()": FunctionFragment;
    "tradingStartTimeOnDEX()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "walletCanSellAfter(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "afterTokenTransfer"
      | "beforeTokenTransfer"
      | "botPreventionDuration"
      | "botProtectionParams"
      | "dexPairAddress"
      | "disableTrading"
      | "enableTrading"
      | "owner"
      | "renounceOwnership"
      | "setDexPairAddress"
      | "setManagersAddress"
      | "setTokenAddress"
      | "tokenAddress"
      | "tradingEnabled"
      | "tradingStartTimeOnDEX"
      | "transferOwnership"
      | "walletCanSellAfter"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "afterTokenTransfer",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "beforeTokenTransfer",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "botPreventionDuration",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "botProtectionParams",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "dexPairAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "disableTrading",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "enableTrading",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setDexPairAddress",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setManagersAddress",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setTokenAddress",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "tradingEnabled",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "tradingStartTimeOnDEX",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "walletCanSellAfter",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "afterTokenTransfer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "beforeTokenTransfer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "botPreventionDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "botProtectionParams",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "dexPairAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "disableTrading",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "enableTrading",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDexPairAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setManagersAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTokenAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokenAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tradingEnabled",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tradingStartTimeOnDEX",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "walletCanSellAfter",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface BotPrevention extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: BotPreventionInterface;

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
    afterTokenTransfer(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    beforeTokenTransfer(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    botPreventionDuration(overrides?: CallOverrides): Promise<[BigNumber]>;

    botProtectionParams(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        activateIfBalanceExeeds: BigNumber;
        maxSellAmount: BigNumber;
        durationBetweenSells: BigNumber;
      }
    >;

    dexPairAddress(overrides?: CallOverrides): Promise<[string]>;

    disableTrading(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    enableTrading(
      _tradingStartTime: PromiseOrValue<BigNumberish>,
      _botPreventionDurationInMinutes: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setDexPairAddress(
      _pairAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setManagersAddress(
      _address: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setTokenAddress(
      _tokenAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    tokenAddress(overrides?: CallOverrides): Promise<[string]>;

    tradingEnabled(overrides?: CallOverrides): Promise<[boolean]>;

    tradingStartTimeOnDEX(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    walletCanSellAfter(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  afterTokenTransfer(
    from: PromiseOrValue<string>,
    to: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  beforeTokenTransfer(
    from: PromiseOrValue<string>,
    to: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  botPreventionDuration(overrides?: CallOverrides): Promise<BigNumber>;

  botProtectionParams(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber] & {
      activateIfBalanceExeeds: BigNumber;
      maxSellAmount: BigNumber;
      durationBetweenSells: BigNumber;
    }
  >;

  dexPairAddress(overrides?: CallOverrides): Promise<string>;

  disableTrading(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  enableTrading(
    _tradingStartTime: PromiseOrValue<BigNumberish>,
    _botPreventionDurationInMinutes: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setDexPairAddress(
    _pairAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setManagersAddress(
    _address: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setTokenAddress(
    _tokenAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  tokenAddress(overrides?: CallOverrides): Promise<string>;

  tradingEnabled(overrides?: CallOverrides): Promise<boolean>;

  tradingStartTimeOnDEX(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  walletCanSellAfter(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    afterTokenTransfer(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    beforeTokenTransfer(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    botPreventionDuration(overrides?: CallOverrides): Promise<BigNumber>;

    botProtectionParams(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        activateIfBalanceExeeds: BigNumber;
        maxSellAmount: BigNumber;
        durationBetweenSells: BigNumber;
      }
    >;

    dexPairAddress(overrides?: CallOverrides): Promise<string>;

    disableTrading(overrides?: CallOverrides): Promise<void>;

    enableTrading(
      _tradingStartTime: PromiseOrValue<BigNumberish>,
      _botPreventionDurationInMinutes: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setDexPairAddress(
      _pairAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setManagersAddress(
      _address: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setTokenAddress(
      _tokenAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    tokenAddress(overrides?: CallOverrides): Promise<string>;

    tradingEnabled(overrides?: CallOverrides): Promise<boolean>;

    tradingStartTimeOnDEX(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    walletCanSellAfter(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    afterTokenTransfer(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    beforeTokenTransfer(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    botPreventionDuration(overrides?: CallOverrides): Promise<BigNumber>;

    botProtectionParams(overrides?: CallOverrides): Promise<BigNumber>;

    dexPairAddress(overrides?: CallOverrides): Promise<BigNumber>;

    disableTrading(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    enableTrading(
      _tradingStartTime: PromiseOrValue<BigNumberish>,
      _botPreventionDurationInMinutes: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setDexPairAddress(
      _pairAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setManagersAddress(
      _address: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setTokenAddress(
      _tokenAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    tokenAddress(overrides?: CallOverrides): Promise<BigNumber>;

    tradingEnabled(overrides?: CallOverrides): Promise<BigNumber>;

    tradingStartTimeOnDEX(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    walletCanSellAfter(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    afterTokenTransfer(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    beforeTokenTransfer(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    botPreventionDuration(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    botProtectionParams(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    dexPairAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    disableTrading(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    enableTrading(
      _tradingStartTime: PromiseOrValue<BigNumberish>,
      _botPreventionDurationInMinutes: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setDexPairAddress(
      _pairAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setManagersAddress(
      _address: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setTokenAddress(
      _tokenAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    tokenAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tradingEnabled(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tradingStartTimeOnDEX(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    walletCanSellAfter(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
