// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "./IVault.sol";

interface IAirdropVault is IVault {
    function approveToAirdropContract(address _airdropContractAddress) external;
}
