// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Vault.sol";
import "./interfaces/IManagers.sol";
import "./interfaces/IPancakeFactory.sol";
import "./interfaces/IPancakeRouter02.sol";
import "./interfaces/IPancakePair.sol";
import "hardhat/console.sol";

contract AirdropVault is Vault {
    address airdropContractAddress;

	event DepositAirdropContract(uint256 indexed time, uint256 indexed amount);
    constructor(
        string memory _vaultName,
        address _proxyAddress,
        address _soulsTokenAddress,
        address _managersAddress
    ) Vault(_vaultName, _proxyAddress, _soulsTokenAddress, _managersAddress) {}

    function withdrawTokens(address[] calldata, uint256[] calldata) external view override onlyManager {
        revert("Use depositToAirdropContract function");
    }

    function depositToAirdropContract(address _airdropContractAddress, uint256 _amount) external onlyManager {
		//TODO: check interface
        require(_airdropContractAddress != address(0), "Airdrop contract address cannot be zero");
        require(_amount > 0, "Not allowed zero amount");
        address[] memory _receiverAddresses = new address[](1);
        uint256[] memory _amounts = new uint256[](1);

        _receiverAddresses[0] = _airdropContractAddress;
        _amounts[0] = _amount;
		emit DepositAirdropContract(block.timestamp, _amount);
        _withdrawTokens(_receiverAddresses, _amounts, _amount);
    }
}
