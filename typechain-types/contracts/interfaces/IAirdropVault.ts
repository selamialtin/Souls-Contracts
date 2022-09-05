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
} from "../../common";

export interface IAirdropVaultInterface extends utils.Interface {
  functions: {
    "approveToAirdropContract(address)": FunctionFragment;
    "lockTokens(uint256,uint256,uint256,uint256,uint256)": FunctionFragment;
    "withdrawTokens(address[],uint256[])": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "approveToAirdropContract"
      | "lockTokens"
      | "withdrawTokens"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "approveToAirdropContract",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "lockTokens",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawTokens",
    values: [PromiseOrValue<string>[], PromiseOrValue<BigNumberish>[]]
  ): string;

  decodeFunctionResult(
    functionFragment: "approveToAirdropContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "lockTokens", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawTokens",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IAirdropVault extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IAirdropVaultInterface;

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
    approveToAirdropContract(
      _airdropContractAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    lockTokens(
      _totalAmount: PromiseOrValue<BigNumberish>,
      _initialRelease: PromiseOrValue<BigNumberish>,
      _lockDurationInDays: PromiseOrValue<BigNumberish>,
      _countOfVesting: PromiseOrValue<BigNumberish>,
      _releaseFrequencyInDays: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    withdrawTokens(
      _receivers: PromiseOrValue<string>[],
      _amounts: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  approveToAirdropContract(
    _airdropContractAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  lockTokens(
    _totalAmount: PromiseOrValue<BigNumberish>,
    _initialRelease: PromiseOrValue<BigNumberish>,
    _lockDurationInDays: PromiseOrValue<BigNumberish>,
    _countOfVesting: PromiseOrValue<BigNumberish>,
    _releaseFrequencyInDays: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  withdrawTokens(
    _receivers: PromiseOrValue<string>[],
    _amounts: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    approveToAirdropContract(
      _airdropContractAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    lockTokens(
      _totalAmount: PromiseOrValue<BigNumberish>,
      _initialRelease: PromiseOrValue<BigNumberish>,
      _lockDurationInDays: PromiseOrValue<BigNumberish>,
      _countOfVesting: PromiseOrValue<BigNumberish>,
      _releaseFrequencyInDays: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawTokens(
      _receivers: PromiseOrValue<string>[],
      _amounts: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    approveToAirdropContract(
      _airdropContractAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    lockTokens(
      _totalAmount: PromiseOrValue<BigNumberish>,
      _initialRelease: PromiseOrValue<BigNumberish>,
      _lockDurationInDays: PromiseOrValue<BigNumberish>,
      _countOfVesting: PromiseOrValue<BigNumberish>,
      _releaseFrequencyInDays: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    withdrawTokens(
      _receivers: PromiseOrValue<string>[],
      _amounts: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    approveToAirdropContract(
      _airdropContractAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    lockTokens(
      _totalAmount: PromiseOrValue<BigNumberish>,
      _initialRelease: PromiseOrValue<BigNumberish>,
      _lockDurationInDays: PromiseOrValue<BigNumberish>,
      _countOfVesting: PromiseOrValue<BigNumberish>,
      _releaseFrequencyInDays: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    withdrawTokens(
      _receivers: PromiseOrValue<string>[],
      _amounts: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
