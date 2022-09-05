/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { Airdrop, AirdropInterface } from "../../contracts/Airdrop";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_managersAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_soulsTokenAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "airdropRecordCount",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "airdropRecords",
    outputs: [
      {
        internalType: "bytes32",
        name: "merkleRootHash",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "totalAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "claimRecords",
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
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "bytes32[]",
        name: "_merkleProof",
        type: "bytes32[]",
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
        internalType: "bytes32",
        name: "_merkleRootHash",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_totalAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_endTime",
        type: "uint256",
      },
    ],
    name: "createNewAirdrop",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "soulsTokenAddress",
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

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001a0b38038062001a0b83398181016040528101906200003791906200012a565b816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505062000171565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620000f282620000c5565b9050919050565b6200010481620000e5565b81146200011057600080fd5b50565b6000815190506200012481620000f9565b92915050565b60008060408385031215620001445762000143620000c0565b5b6000620001548582860162000113565b9250506020620001678582860162000113565b9150509250929050565b61188a80620001816000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c80635920561e1461006757806363356e2d1461008557806378fb1da5146100b8578063797b746c146100d65780639a114cb2146100f2578063a0ec0e081461010e575b600080fd5b61006f61013e565b60405161007c9190610c3c565b60405180910390f35b61009f600480360381019061009a9190610c97565b610164565b6040516100af9493929190610cec565b60405180910390f35b6100c06101a4565b6040516100cd9190610d31565b60405180910390f35b6100f060048036038101906100eb9190610d78565b6101aa565b005b61010c60048036038101906101079190610e44565b6107a5565b005b61012860048036038101906101239190610ed0565b610b19565b6040516101359190610f2b565b60405180910390f35b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6001818154811061017457600080fd5b90600052602060002090600402016000915090508060000154908060010154908060020154908060030154905084565b60035481565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f3ae2415336040518263ffffffff1660e01b81526004016102039190610c3c565b602060405180830381865afa158015610220573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102449190610f72565b610283576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161027a90610ffc565b60405180910390fd5b6000602060ff16116102ca576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102c190611068565b60405180910390fd5b42821161030c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610303906110d4565b60405180910390fd5b81811161034e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161034590611166565b60405180910390fd5b600060035411156103d057600180808054905061036b91906111b5565b8154811061037c5761037b6111e9565b5b90600052602060002090600402016003015442116103cf576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103c690611264565b60405180910390fd5b5b60008311610413576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161040a906112d0565b60405180910390fd5b82600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b815260040161046f9190610c3c565b602060405180830381865afa15801561048c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104b09190611305565b10156104f1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104e8906113a4565b60405180910390fd5b60006040518060400160405280601281526020017f437265617465206e65772061697264726f70000000000000000000000000000081525090506000858585856040516020016105449493929190610cec565b604051602081830303815290604052905060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b9d94383836040518363ffffffff1660e01b81526004016105b09291906114a1565b600060405180830381600087803b1580156105ca57600080fd5b505af11580156105de573d6000803e3d6000fd5b5050505060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f621394d83836040518363ffffffff1660e01b815260040161063d9291906114a1565b602060405180830381865afa15801561065a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061067e9190610f72565b1561079d57600160405180608001604052808881526020018781526020018681526020018581525090806001815401808255809150506001900390600052602060002090600402016000909190919091506000820151816000015560208201518160010155604082015181600201556060820151816003015550506003600081548092919061070c906114d8565b919050555060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f4daa673836040518263ffffffff1660e01b815260040161076a9190611521565b600060405180830381600087803b15801561078457600080fd5b505af1158015610798573d6000803e3d6000fd5b505050505b505050505050565b6000600354116107ea576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107e19061158f565b60405180910390fd5b600060016003546107fb91906111b5565b9050600060018281548110610813576108126111e9565b5b90600052602060002090600402016040518060800160405290816000820154815260200160018201548152602001600282015481526020016003820154815250509050806040015142101561089d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610894906115fb565b60405180910390fd5b806060015142106108e3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108da90611667565b60405180910390fd5b60003383876040516020016108fa939291906116f0565b6040516020818303038152906040528051906020012090506109228585846000015184610b48565b610961576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109589061179f565b60405180910390fd5b6002600084815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16156109ff576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109f69061180b565b60405180910390fd5b60016002600085815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb33886040518363ffffffff1660e01b8152600401610ac592919061182b565b6020604051808303816000875af1158015610ae4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b089190610f72565b610b1157600080fd5b505050505050565b60026020528160005260406000206020528060005260406000206000915091509054906101000a900460ff1681565b600082610b56868685610b61565b149050949350505050565b60008082905060005b85859050811015610bad57610b9882878784818110610b8c57610b8b6111e9565b5b90506020020135610bb9565b91508080610ba5906114d8565b915050610b6a565b50809150509392505050565b6000818310610bd157610bcc8284610be4565b610bdc565b610bdb8383610be4565b5b905092915050565b600082600052816020526040600020905092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610c2682610bfb565b9050919050565b610c3681610c1b565b82525050565b6000602082019050610c516000830184610c2d565b92915050565b600080fd5b600080fd5b6000819050919050565b610c7481610c61565b8114610c7f57600080fd5b50565b600081359050610c9181610c6b565b92915050565b600060208284031215610cad57610cac610c57565b5b6000610cbb84828501610c82565b91505092915050565b6000819050919050565b610cd781610cc4565b82525050565b610ce681610c61565b82525050565b6000608082019050610d016000830187610cce565b610d0e6020830186610cdd565b610d1b6040830185610cdd565b610d286060830184610cdd565b95945050505050565b6000602082019050610d466000830184610cdd565b92915050565b610d5581610cc4565b8114610d6057600080fd5b50565b600081359050610d7281610d4c565b92915050565b60008060008060808587031215610d9257610d91610c57565b5b6000610da087828801610d63565b9450506020610db187828801610c82565b9350506040610dc287828801610c82565b9250506060610dd387828801610c82565b91505092959194509250565b600080fd5b600080fd5b600080fd5b60008083601f840112610e0457610e03610ddf565b5b8235905067ffffffffffffffff811115610e2157610e20610de4565b5b602083019150836020820283011115610e3d57610e3c610de9565b5b9250929050565b600080600060408486031215610e5d57610e5c610c57565b5b6000610e6b86828701610c82565b935050602084013567ffffffffffffffff811115610e8c57610e8b610c5c565b5b610e9886828701610dee565b92509250509250925092565b610ead81610c1b565b8114610eb857600080fd5b50565b600081359050610eca81610ea4565b92915050565b60008060408385031215610ee757610ee6610c57565b5b6000610ef585828601610c82565b9250506020610f0685828601610ebb565b9150509250929050565b60008115159050919050565b610f2581610f10565b82525050565b6000602082019050610f406000830184610f1c565b92915050565b610f4f81610f10565b8114610f5a57600080fd5b50565b600081519050610f6c81610f46565b92915050565b600060208284031215610f8857610f87610c57565b5b6000610f9684828501610f5d565b91505092915050565b600082825260208201905092915050565b7f4f4e4c59204d414e41474552533a204e6f7420617574686f72697a6564000000600082015250565b6000610fe6601d83610f9f565b9150610ff182610fb0565b602082019050919050565b6000602082019050818103600083015261101581610fd9565b9050919050565b7f496e76616c6964206d65726b6c6520726f6f7400000000000000000000000000600082015250565b6000611052601383610f9f565b915061105d8261101c565b602082019050919050565b6000602082019050818103600083015261108181611045565b9050919050565b7f53746172742074696d65206d75737420626520696e2074686520667574757265600082015250565b60006110be602083610f9f565b91506110c982611088565b602082019050919050565b600060208201905081810360008301526110ed816110b1565b9050919050565b7f456e642074696d65206d757374206265206c61746572207468616e207374617260008201527f742074696d650000000000000000000000000000000000000000000000000000602082015250565b6000611150602683610f9f565b915061115b826110f4565b604082019050919050565b6000602082019050818103600083015261117f81611143565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006111c082610c61565b91506111cb83610c61565b9250828210156111de576111dd611186565b5b828203905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f43757272656e7420706572696f64206469646e27742066696e69736820796574600082015250565b600061124e602083610f9f565b915061125982611218565b602082019050919050565b6000602082019050818103600083015261127d81611241565b9050919050565b7f546f74616c20616d6f756e742063616e6e6f74206265207a65726f0000000000600082015250565b60006112ba601b83610f9f565b91506112c582611284565b602082019050919050565b600060208201905081810360008301526112e9816112ad565b9050919050565b6000815190506112ff81610c6b565b92915050565b60006020828403121561131b5761131a610c57565b5b6000611329848285016112f0565b91505092915050565b7f4e6f7420656e6f7567682062616c616e636520696e2061697264726f7020636f60008201527f6e74726163740000000000000000000000000000000000000000000000000000602082015250565b600061138e602683610f9f565b915061139982611332565b604082019050919050565b600060208201905081810360008301526113bd81611381565b9050919050565b600081519050919050565b60005b838110156113ed5780820151818401526020810190506113d2565b838111156113fc576000848401525b50505050565b6000601f19601f8301169050919050565b600061141e826113c4565b6114288185610f9f565b93506114388185602086016113cf565b61144181611402565b840191505092915050565b600081519050919050565b600082825260208201905092915050565b60006114738261144c565b61147d8185611457565b935061148d8185602086016113cf565b61149681611402565b840191505092915050565b600060408201905081810360008301526114bb8185611413565b905081810360208301526114cf8184611468565b90509392505050565b60006114e382610c61565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141561151657611515611186565b5b600182019050919050565b6000602082019050818103600083015261153b8184611413565b905092915050565b7f54686572652069736e277420616e79206163746976652061697264726f700000600082015250565b6000611579601e83610f9f565b915061158482611543565b602082019050919050565b600060208201905081810360008301526115a88161156c565b9050919050565b7f41697264726f7020706572696f64206469646e27742073746172742079657400600082015250565b60006115e5601f83610f9f565b91506115f0826115af565b602082019050919050565b60006020820190508181036000830152611614816115d8565b9050919050565b7f41697264726f7020706572696f642068617320656e6465640000000000000000600082015250565b6000611651601883610f9f565b915061165c8261161b565b602082019050919050565b6000602082019050818103600083015261168081611644565b9050919050565b60008160601b9050919050565b600061169f82611687565b9050919050565b60006116b182611694565b9050919050565b6116c96116c482610c1b565b6116a6565b82525050565b6000819050919050565b6116ea6116e582610c61565b6116cf565b82525050565b60006116fc82866116b8565b60148201915061170c82856116d9565b60208201915061171c82846116d9565b602082019150819050949350505050565b7f5468657265206973206e6f20616c6c6f636174696f6e20666f722063616c6c6560008201527f72206f722077726f6e6720706172616d65746572730000000000000000000000602082015250565b6000611789603583610f9f565b91506117948261172d565b604082019050919050565b600060208201905081810360008301526117b88161177c565b9050919050565b7f416c726561647920636c61696d65640000000000000000000000000000000000600082015250565b60006117f5600f83610f9f565b9150611800826117bf565b602082019050919050565b60006020820190508181036000830152611824816117e8565b9050919050565b60006040820190506118406000830185610c2d565b61184d6020830184610cdd565b939250505056fea26469706673582212208e128b587ee877dc2a1d48b51f230a03fbca9a78de5fc10a5a989387facaf1b264736f6c634300080c0033";

type AirdropConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AirdropConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Airdrop__factory extends ContractFactory {
  constructor(...args: AirdropConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _managersAddress: PromiseOrValue<string>,
    _soulsTokenAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Airdrop> {
    return super.deploy(
      _managersAddress,
      _soulsTokenAddress,
      overrides || {}
    ) as Promise<Airdrop>;
  }
  override getDeployTransaction(
    _managersAddress: PromiseOrValue<string>,
    _soulsTokenAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _managersAddress,
      _soulsTokenAddress,
      overrides || {}
    );
  }
  override attach(address: string): Airdrop {
    return super.attach(address) as Airdrop;
  }
  override connect(signer: Signer): Airdrop__factory {
    return super.connect(signer) as Airdrop__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AirdropInterface {
    return new utils.Interface(_abi) as AirdropInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Airdrop {
    return new Contract(address, _abi, signerOrProvider) as Airdrop;
  }
}