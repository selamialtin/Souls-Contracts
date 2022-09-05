/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  AirdropVault,
  AirdropVaultInterface,
} from "../../contracts/AirdropVault";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_vaultName",
        type: "string",
      },
      {
        internalType: "address",
        name: "_proxyAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_soulsTokenAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_managersAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "DepositAirdropContract",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "date",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "DepositTokens",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "date",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "vestingIndex",
        type: "uint256",
      },
    ],
    name: "ReleaseVesting",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "date",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [],
    name: "currentVestingIndex",
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
        name: "_airdropContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "depositToAirdropContract",
    outputs: [],
    stateMutability: "nonpayable",
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
        internalType: "address",
        name: "_tokenHolder",
        type: "address",
      },
    ],
    name: "depositTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAvailableAmountForWithdraw",
    outputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVestingData",
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
            name: "unlockTime",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "released",
            type: "bool",
          },
        ],
        internalType: "struct Vault.LockedToken[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
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
        name: "_countOfVestings",
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
    inputs: [],
    name: "proxyAddress",
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
  {
    inputs: [],
    name: "releasedAmount",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tokenVestings",
    outputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "unlockTime",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "released",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalWithdrawnAmount",
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
    inputs: [],
    name: "vaultName",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    name: "withdrawTokens",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620035e8380380620035e883398181016040528101906200003791906200052f565b83838383600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415620000ae576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620000a59062000621565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141562000121576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620001189062000693565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141562000194576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016200018b9062000705565b60405180910390fd5b8360069080519060200190620001ac9291906200027d565b5082600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050505050506200078c565b8280546200028b9062000756565b90600052602060002090601f016020900481019282620002af5760008555620002fb565b82601f10620002ca57805160ff1916838001178555620002fb565b82800160010185558215620002fb579182015b82811115620002fa578251825591602001919060010190620002dd565b5b5090506200030a91906200030e565b5090565b5b80821115620003295760008160009055506001016200030f565b5090565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b62000396826200034b565b810181811067ffffffffffffffff82111715620003b857620003b76200035c565b5b80604052505050565b6000620003cd6200032d565b9050620003db82826200038b565b919050565b600067ffffffffffffffff821115620003fe57620003fd6200035c565b5b62000409826200034b565b9050602081019050919050565b60005b838110156200043657808201518184015260208101905062000419565b8381111562000446576000848401525b50505050565b6000620004636200045d84620003e0565b620003c1565b90508281526020810184848401111562000482576200048162000346565b5b6200048f84828562000416565b509392505050565b600082601f830112620004af57620004ae62000341565b5b8151620004c18482602086016200044c565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620004f782620004ca565b9050919050565b6200050981620004ea565b81146200051557600080fd5b50565b6000815190506200052981620004fe565b92915050565b600080600080608085870312156200054c576200054b62000337565b5b600085015167ffffffffffffffff8111156200056d576200056c6200033c565b5b6200057b8782880162000497565b94505060206200058e8782880162000518565b9350506040620005a18782880162000518565b9250506060620005b48782880162000518565b91505092959194509250565b600082825260208201905092915050565b7f496e76616c69642070726f787920616464726573730000000000000000000000600082015250565b600062000609601583620005c0565b91506200061682620005d1565b602082019050919050565b600060208201905081810360008301526200063c81620005fa565b9050919050565b7f496e76616c6964206d616e616765727320616464726573730000000000000000600082015250565b60006200067b601883620005c0565b9150620006888262000643565b602082019050919050565b60006020820190508181036000830152620006ae816200066c565b9050919050565b7f496e76616c696420746f6b656e20616464726573730000000000000000000000600082015250565b6000620006ed601583620005c0565b9150620006fa82620006b5565b602082019050919050565b600060208201905081810360008301526200072081620006de565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200076f57607f821691505b6020821081141562000786576200078562000727565b5b50919050565b612e4c806200079c6000396000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c80634f6300a21161008c5780638e023090116100665780638e023090146101de578063a2af9393146101fc578063bd13a8031461022e578063faca77071461024a576100cf565b80634f6300a2146101885780635920561e146101a457806360a2ba52146101c2576100cf565b8063041752e3146100d45780630ace9ca0146100f25780631d8b44c51461011057806323f5c02d1461012e57806335bd48e51461014c57806345d30a171461016a575b600080fd5b6100dc610266565b6040516100e991906119d7565b60405180910390f35b6100fa6102f4565b6040516101079190611a92565b60405180910390f35b610118610382565b6040516101259190611ac3565b60405180910390f35b610136610388565b6040516101439190611b1f565b60405180910390f35b6101546103ae565b6040516101619190611ac3565b60405180910390f35b6101726103b4565b60405161017f9190611ac3565b60405180910390f35b6101a2600480360381019061019d9190611b9c565b6103ba565b005b6101ac610883565b6040516101b99190611b1f565b60405180910390f35b6101dc60048036038101906101d79190611bdc565b6108a9565b005b6101e6610d0e565b6040516101f39190611ac3565b60405180910390f35b61021660048036038101906102119190611c57565b610ddb565b60405161022593929190611c93565b60405180910390f35b61024860048036038101906102439190611d85565b610e22565b005b610264600480360381019061025f9190611e06565b610f36565b005b60606007805480602002602001604051908101604052809291908181526020016000905b828210156102eb578382906000526020600020906003020160405180606001604052908160008201548152602001600182015481526020016002820160009054906101000a900460ff1615151515815250508152602001906001019061028a565b50505050905090565b6006805461030190611e75565b80601f016020809104026020016040519081016040528092919081815260200182805461032d90611e75565b801561037a5780601f1061034f5761010080835404028352916020019161037a565b820191906000526020600020905b81548152906001019060200180831161035d57829003601f168201915b505050505081565b60055481565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60045481565b60035481565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f3ae2415336040518263ffffffff1660e01b81526004016104139190611b1f565b602060405180830381865afa158015610430573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104549190611ed3565b610493576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161048a90611f4c565b60405180910390fd5b600082116104d6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104cd90611fb8565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610546576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161053d9061204a565b60405180910390fd5b6000600660405160200161055a9190612155565b60405160208183030381529060405290506000838360405160200161058092919061218a565b604051602081830303815290604052905060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b9d94383836040518363ffffffff1660e01b81526004016105ec929190612208565b600060405180830381600087803b15801561060657600080fd5b505af115801561061a573d6000803e3d6000fd5b5050505060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f621394d83836040518363ffffffff1660e01b8152600401610679929190612208565b602060405180830381865afa158015610696573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106ba9190611ed3565b1561087d5783600360008282546106d1919061226e565b92505081905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd8430876040518463ffffffff1660e01b8152600401610737939291906122c4565b6020604051808303816000875af1158015610756573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061077a9190611ed3565b6107b9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107b090612347565b60405180910390fd5b427f2522be42592f34e2ca9797604751c6950bec2b2edd55de8bdaede606557b67fe856040516107e99190611ac3565b60405180910390a260008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f4daa673836040518263ffffffff1660e01b815260040161084a9190611a92565b600060405180830381600087803b15801561086457600080fd5b505af1158015610878573d6000803e3d6000fd5b505050505b50505050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600780549050146108f1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108e8906123d9565b60405180910390fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610981576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161097890612445565b60405180910390fd5b600085116109c4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109bb906124b1565b60405180910390fd5b60008211610a07576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109fe9061251d565b60405180910390fd5b60018214610a535760008111610a52576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a4990612589565b60405180910390fd5b5b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508073ffffffffffffffffffffffffffffffffffffffff166323b872dd3330896040518463ffffffff1660e01b8152600401610ab7939291906122c4565b6020604051808303816000875af1158015610ad6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610afa9190611ed3565b610b39576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b30906125f5565b60405180910390fd5b600080861115610bd15760076040518060600160405280888152602001428152602001600015158152509080600181540180825580915050600190039060005260206000209060030201600090919091909150600082015181600001556020820151816001015560408201518160020160006101000a81548160ff02191690831515021790555050508581610bce919061226e565b90505b60006201518086610be29190612615565b905060006201518085610bf59190612615565b905060005b86811015610d02576000878a8c610c11919061266f565b610c1b91906126d2565b9050600188610c2a919061266f565b821415610c4057848b610c3d919061266f565b90505b600760405180606001604052808381526020018585610c5f9190612615565b8742610c6b919061226e565b610c75919061226e565b8152602001600015158152509080600181540180825580915050600190039060005260206000209060030201600090919091909150600082015181600001556020820151816001015560408201518160020160006101000a81548160ff02191690831515021790555050508085610cec919061226e565b9450508080610cfa90612703565b915050610bfa565b50505050505050505050565b6000600554600354610d20919061266f565b9050600780549050600454108015610d5f5750600760045481548110610d4957610d4861274c565b5b9060005260206000209060030201600101544210155b8015610d9d5750600760045481548110610d7c57610d7b61274c565b5b906000526020600020906003020160020160009054906101000a900460ff16155b15610dd857600760045481548110610db857610db761274c565b5b90600052602060002090600302016000015481610dd5919061226e565b90505b90565b60078181548110610deb57600080fd5b90600052602060002090600302016000915090508060000154908060010154908060020160009054906101000a900460ff16905083565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f3ae2415336040518263ffffffff1660e01b8152600401610e7b9190611b1f565b602060405180830381865afa158015610e98573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ebc9190611ed3565b610efb576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ef290611f4c565b60405180910390fd5b6040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f2d906127ed565b60405180910390fd5b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f3ae2415336040518263ffffffff1660e01b8152600401610f8f9190611b1f565b602060405180830381865afa158015610fac573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610fd09190611ed3565b61100f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161100690611f4c565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141561107f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110769061287f565b60405180910390fd5b600081116110c2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110b9906128eb565b60405180910390fd5b6000600167ffffffffffffffff8111156110df576110de61290b565b5b60405190808252806020026020018201604052801561110d5781602001602082028036833780820191505090505b5090506000600167ffffffffffffffff81111561112d5761112c61290b565b5b60405190808252806020026020018201604052801561115b5781602001602082028036833780820191505090505b50905083826000815181106111735761117261274c565b5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff168152505082816000815181106111c2576111c161274c565b5b60200260200101818152505082427ee307efc93ee74332b04b820fda3699299630cbbe1f068be0b9fa09555aea6860405160405180910390a361120682828561120c565b50505050565b6000805b83518110156112b157600084828151811061122e5761122d61274c565b5b602002602001015111611276576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161126d90612986565b60405180910390fd5b8381815181106112895761128861274c565b5b60200260200101518261129c919061226e565b915080806112a990612703565b915050611210565b508181146112f4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112eb90612a18565b60405180910390fd5b600554600354611304919061266f565b8211156114435760078054905060045410611354576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161134b90612aaa565b60405180910390fd5b60076004548154811061136a5761136961274c565b5b9060005260206000209060030201600101544210156113be576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113b590612b3c565b60405180910390fd5b816005546003546007600454815481106113db576113da61274c565b5b9060005260206000209060030201600001546113f7919061226e565b611401919061266f565b1015611442576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161143990612bce565b60405180910390fd5b5b600060066040516020016114579190612c14565b60405160208183030381529060405290506000858560405160200161147d929190612db6565b604051602081830303815290604052905060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b9d94383836040518363ffffffff1660e01b81526004016114e9929190612208565b600060405180830381600087803b15801561150357600080fd5b505af1158015611517573d6000803e3d6000fd5b5050505060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f621394d83836040518363ffffffff1660e01b8152600401611576929190612208565b602060405180830381865afa158015611593573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115b79190611ed3565b156118aa576005546003546115cc919061266f565b8411156116c057600460008154809291906115e690612703565b91905055506001600760016004546115fe919061266f565b8154811061160f5761160e61274c565b5b906000526020600020906003020160020160006101000a81548160ff02191690831515021790555060076001600454611648919061266f565b815481106116595761165861274c565b5b9060005260206000209060030201600001546003600082825461167c919061226e565b925050819055506001600454611692919061266f565b427fec3eabb9ffcce3ef501ade330d6caa15fb387bd40058760c9e06c3e34277f13960405160405180910390a35b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905060005b87518110156118035760008882815181106117085761170761274c565b5b6020026020010151905060008883815181106117275761172661274c565b5b602002602001015190508373ffffffffffffffffffffffffffffffffffffffff1663a9059cbb83836040518363ffffffff1660e01b815260040161176c929190612ded565b6020604051808303816000875af115801561178b573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117af9190611ed3565b6117ee576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016117e5906125f5565b60405180910390fd5b505080806117fb90612703565b9150506116ea565b508460056000828254611816919061226e565b9250508190555060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f4daa673846040518263ffffffff1660e01b81526004016118769190611a92565b600060405180830381600087803b15801561189057600080fd5b505af11580156118a4573d6000803e3d6000fd5b50505050505b505050505050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6000819050919050565b6118f1816118de565b82525050565b60008115159050919050565b61190c816118f7565b82525050565b60608201600082015161192860008501826118e8565b50602082015161193b60208501826118e8565b50604082015161194e6040850182611903565b50505050565b60006119608383611912565b60608301905092915050565b6000602082019050919050565b6000611984826118b2565b61198e81856118bd565b9350611999836118ce565b8060005b838110156119ca5781516119b18882611954565b97506119bc8361196c565b92505060018101905061199d565b5085935050505092915050565b600060208201905081810360008301526119f18184611979565b905092915050565b600081519050919050565b600082825260208201905092915050565b60005b83811015611a33578082015181840152602081019050611a18565b83811115611a42576000848401525b50505050565b6000601f19601f8301169050919050565b6000611a64826119f9565b611a6e8185611a04565b9350611a7e818560208601611a15565b611a8781611a48565b840191505092915050565b60006020820190508181036000830152611aac8184611a59565b905092915050565b611abd816118de565b82525050565b6000602082019050611ad86000830184611ab4565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000611b0982611ade565b9050919050565b611b1981611afe565b82525050565b6000602082019050611b346000830184611b10565b92915050565b600080fd5b600080fd5b611b4d816118de565b8114611b5857600080fd5b50565b600081359050611b6a81611b44565b92915050565b611b7981611afe565b8114611b8457600080fd5b50565b600081359050611b9681611b70565b92915050565b60008060408385031215611bb357611bb2611b3a565b5b6000611bc185828601611b5b565b9250506020611bd285828601611b87565b9150509250929050565b600080600080600060a08688031215611bf857611bf7611b3a565b5b6000611c0688828901611b5b565b9550506020611c1788828901611b5b565b9450506040611c2888828901611b5b565b9350506060611c3988828901611b5b565b9250506080611c4a88828901611b5b565b9150509295509295909350565b600060208284031215611c6d57611c6c611b3a565b5b6000611c7b84828501611b5b565b91505092915050565b611c8d816118f7565b82525050565b6000606082019050611ca86000830186611ab4565b611cb56020830185611ab4565b611cc26040830184611c84565b949350505050565b600080fd5b600080fd5b600080fd5b60008083601f840112611cef57611cee611cca565b5b8235905067ffffffffffffffff811115611d0c57611d0b611ccf565b5b602083019150836020820283011115611d2857611d27611cd4565b5b9250929050565b60008083601f840112611d4557611d44611cca565b5b8235905067ffffffffffffffff811115611d6257611d61611ccf565b5b602083019150836020820283011115611d7e57611d7d611cd4565b5b9250929050565b60008060008060408587031215611d9f57611d9e611b3a565b5b600085013567ffffffffffffffff811115611dbd57611dbc611b3f565b5b611dc987828801611cd9565b9450945050602085013567ffffffffffffffff811115611dec57611deb611b3f565b5b611df887828801611d2f565b925092505092959194509250565b60008060408385031215611e1d57611e1c611b3a565b5b6000611e2b85828601611b87565b9250506020611e3c85828601611b5b565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680611e8d57607f821691505b60208210811415611ea157611ea0611e46565b5b50919050565b611eb0816118f7565b8114611ebb57600080fd5b50565b600081519050611ecd81611ea7565b92915050565b600060208284031215611ee957611ee8611b3a565b5b6000611ef784828501611ebe565b91505092915050565b7f4f4e4c59204d414e41474552533a204e6f7420617574686f72697a6564000000600082015250565b6000611f36601d83611a04565b9150611f4182611f00565b602082019050919050565b60006020820190508181036000830152611f6581611f29565b9050919050565b7f416d6f756e742063616e6e6f74206265207a65726f0000000000000000000000600082015250565b6000611fa2601583611a04565b9150611fad82611f6c565b602082019050919050565b60006020820190508181036000830152611fd181611f95565b9050919050565b7f546f6b656e20686f6c64657220616464726573732063616e6e6f74206265207a60008201527f65726f0000000000000000000000000000000000000000000000000000000000602082015250565b6000612034602383611a04565b915061203f82611fd8565b604082019050919050565b6000602082019050818103600083015261206381612027565b9050919050565b7f4465706f73697420746f6b656e7320746f200000000000000000000000000000815250565b600081905092915050565b60008190508160005260206000209050919050565b600081546120bd81611e75565b6120c78186612090565b945060018216600081146120e257600181146120f357612126565b60ff19831686528186019350612126565b6120fc8561209b565b60005b8381101561211e578154818901526001820191506020810190506120ff565b838801955050505b50505092915050565b7f205661756c740000000000000000000000000000000000000000000000000000815250565b60006121608261206a565b60128201915061217082846120b0565b915061217b8261212f565b60068201915081905092915050565b600060408201905061219f6000830185611ab4565b6121ac6020830184611b10565b9392505050565b600081519050919050565b600082825260208201905092915050565b60006121da826121b3565b6121e481856121be565b93506121f4818560208601611a15565b6121fd81611a48565b840191505092915050565b600060408201905081810360008301526122228185611a59565b9050818103602083015261223681846121cf565b90509392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000612279826118de565b9150612284836118de565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156122b9576122b861223f565b5b828201905092915050565b60006060820190506122d96000830186611b10565b6122e66020830185611b10565b6122f36040830184611ab4565b949350505050565b7f5472616e736665722066726f6d206572726f7200000000000000000000000000600082015250565b6000612331601383611a04565b915061233c826122fb565b602082019050919050565b6000602082019050818103600083015261236081612324565b9050919050565b7f4f6e6c79206f6e63652066756e6374696f6e207761732063616c6c656420626560008201527f666f726500000000000000000000000000000000000000000000000000000000602082015250565b60006123c3602483611a04565b91506123ce82612367565b604082019050919050565b600060208201905081810360008301526123f2816123b6565b9050919050565b7f4f4e4c592050524f58593a204e6f7420617574686f72697a6564000000000000600082015250565b600061242f601a83611a04565b915061243a826123f9565b602082019050919050565b6000602082019050818103600083015261245e81612422565b9050919050565b7f5a65726f20616d6f756e74000000000000000000000000000000000000000000600082015250565b600061249b600b83611a04565b91506124a682612465565b602082019050919050565b600060208201905081810360008301526124ca8161248e565b9050919050565b7f496e76616c69642076657374696e6720636f756e740000000000000000000000600082015250565b6000612507601583611a04565b9150612512826124d1565b602082019050919050565b60006020820190508181036000830152612536816124fa565b9050919050565b7f496e76616c6964206672657175656e6379000000000000000000000000000000600082015250565b6000612573601183611a04565b915061257e8261253d565b602082019050919050565b600060208201905081810360008301526125a281612566565b9050919050565b7f546f6b656e207472616e73666572206572726f72000000000000000000000000600082015250565b60006125df601483611a04565b91506125ea826125a9565b602082019050919050565b6000602082019050818103600083015261260e816125d2565b9050919050565b6000612620826118de565b915061262b836118de565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156126645761266361223f565b5b828202905092915050565b600061267a826118de565b9150612685836118de565b9250828210156126985761269761223f565b5b828203905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b60006126dd826118de565b91506126e8836118de565b9250826126f8576126f76126a3565b5b828204905092915050565b600061270e826118de565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156127415761274061223f565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f557365206465706f736974546f41697264726f70436f6e74726163742066756e60008201527f6374696f6e000000000000000000000000000000000000000000000000000000602082015250565b60006127d7602583611a04565b91506127e28261277b565b604082019050919050565b60006020820190508181036000830152612806816127ca565b9050919050565b7f41697264726f7020636f6e747261637420616464726573732063616e6e6f742060008201527f6265207a65726f00000000000000000000000000000000000000000000000000602082015250565b6000612869602783611a04565b91506128748261280d565b604082019050919050565b600060208201905081810360008301526128988161285c565b9050919050565b7f4e6f7420616c6c6f776564207a65726f20616d6f756e74000000000000000000600082015250565b60006128d5601783611a04565b91506128e08261289f565b602082019050919050565b60006020820190508181036000830152612904816128c8565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f5a65726f20746f6b656e20616d6f756e7420696e206461746100000000000000600082015250565b6000612970601983611a04565b915061297b8261293a565b602082019050919050565b6000602082019050818103600083015261299f81612963565b9050919050565b7f546f74616c206f6620616d6f756e7473206172726179206973206e6f7420657160008201527f75616c207769746820746f74616c20616d6f756e740000000000000000000000602082015250565b6000612a02603583611a04565b9150612a0d826129a6565b604082019050919050565b60006020820190508181036000830152612a31816129f5565b9050919050565b7f4e6f7420656e6f7567682072656c656173656420746f6b656e7320616e64206e60008201527f6f206d6f72652076657374696e67000000000000000000000000000000000000602082015250565b6000612a94602e83611a04565b9150612a9f82612a38565b604082019050919050565b60006020820190508181036000830152612ac381612a87565b9050919050565b7f5761697420666f72206e6578742076657374696e672072656c6561736520646160008201527f7465000000000000000000000000000000000000000000000000000000000000602082015250565b6000612b26602283611a04565b9150612b3182612aca565b604082019050919050565b60006020820190508181036000830152612b5581612b19565b9050919050565b7f4e6f7420656e6f75676820616d6f756e7420696e2072656c656173656420626160008201527f6c616e6365000000000000000000000000000000000000000000000000000000602082015250565b6000612bb8602583611a04565b9150612bc382612b5c565b604082019050919050565b60006020820190508181036000830152612be781612bab565b9050919050565b7f576974686472617720546f6b656e732046726f6d200000000000000000000000815250565b6000612c1f82612bee565b601582019150612c2f82846120b0565b9150612c3a8261212f565b60068201915081905092915050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b612c7e81611afe565b82525050565b6000612c908383612c75565b60208301905092915050565b6000602082019050919050565b6000612cb482612c49565b612cbe8185612c54565b9350612cc983612c65565b8060005b83811015612cfa578151612ce18882612c84565b9750612cec83612c9c565b925050600181019050612ccd565b5085935050505092915050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6000612d3f83836118e8565b60208301905092915050565b6000602082019050919050565b6000612d6382612d07565b612d6d8185612d12565b9350612d7883612d23565b8060005b83811015612da9578151612d908882612d33565b9750612d9b83612d4b565b925050600181019050612d7c565b5085935050505092915050565b60006040820190508181036000830152612dd08185612ca9565b90508181036020830152612de48184612d58565b90509392505050565b6000604082019050612e026000830185611b10565b612e0f6020830184611ab4565b939250505056fea26469706673582212206b5d0286a2b6a245f551f4f2c2fbd94fc02e78601ab8aeff30110c06218af58364736f6c634300080c0033";

type AirdropVaultConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AirdropVaultConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class AirdropVault__factory extends ContractFactory {
  constructor(...args: AirdropVaultConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _vaultName: PromiseOrValue<string>,
    _proxyAddress: PromiseOrValue<string>,
    _soulsTokenAddress: PromiseOrValue<string>,
    _managersAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<AirdropVault> {
    return super.deploy(
      _vaultName,
      _proxyAddress,
      _soulsTokenAddress,
      _managersAddress,
      overrides || {}
    ) as Promise<AirdropVault>;
  }
  override getDeployTransaction(
    _vaultName: PromiseOrValue<string>,
    _proxyAddress: PromiseOrValue<string>,
    _soulsTokenAddress: PromiseOrValue<string>,
    _managersAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _vaultName,
      _proxyAddress,
      _soulsTokenAddress,
      _managersAddress,
      overrides || {}
    );
  }
  override attach(address: string): AirdropVault {
    return super.attach(address) as AirdropVault;
  }
  override connect(signer: Signer): AirdropVault__factory {
    return super.connect(signer) as AirdropVault__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AirdropVaultInterface {
    return new utils.Interface(_abi) as AirdropVaultInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AirdropVault {
    return new Contract(address, _abi, signerOrProvider) as AirdropVault;
  }
}
