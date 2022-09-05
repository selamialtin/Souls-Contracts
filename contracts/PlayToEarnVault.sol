// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Vault.sol";
import "./interfaces/IManagers.sol";
import "./interfaces/IPancakeFactory.sol";
import "./interfaces/IPancakeRouter02.sol";
import "./interfaces/IPancakePair.sol";
import "hardhat/console.sol";

contract PlayToEarnVault is Vault {
    address public playToEarnServiceAddress;
    mapping(string => uint256) public depositRecords;

    event PlayerDeposit(uint256 indexed timestamp, string indexed playfabTxId, uint256 indexed amount);
    event PlayerWithdraw(uint256 indexed timestamp, address[] indexed playerWallet, uint256[] indexed amount);

    constructor(
        string memory _vaultName,
        address _proxyAddress,
        address _soulsTokenAddress,
        address _managersAddress,
        address _playToEarnServiceAddress
    ) Vault(_vaultName, _proxyAddress, _soulsTokenAddress, _managersAddress) {
        playToEarnServiceAddress = _playToEarnServiceAddress;
    }

    //Managers function
    function setPlayToEarnServiceAddress(address _newAddress) external onlyManager {
        require(_newAddress != address(0), "New address cannot be zero");
		require(managers.isManager(_newAddress), "Service address cannot be from manager addresses");
        string memory _title = string.concat("Set play to earn service address");

        bytes memory _valueInBytes = abi.encode(_newAddress);
        managers.approveTopic(_title, _valueInBytes);

        if (managers.isApproved(_title, _valueInBytes)) {
            playToEarnServiceAddress = _newAddress;
            managers.deleteTopic(_title);
        }
    }

    function withdrawTokens(address[] calldata, uint256[] calldata) external view override onlyManager {
        revert("Use playerWithdrawTokensFromGame function");
    }

    function playerDepositTokensToGame(string calldata _playfabTxId, uint256 _amount) external {
        require(_amount > 0, "Amount cannot be zero");
        emit PlayerDeposit(block.timestamp, _playfabTxId, _amount);
        releasedAmount += _amount;
        depositRecords[_playfabTxId] = _amount;
        require(IERC20(soulsTokenAddress).transferFrom(msg.sender, address(this), _amount), "Transfer from error");
    }

	//TODO: set protections, time and amount limit
	
    function playerWithdrawTokensFromGame(address[] calldata _players, uint256[] calldata _amounts) external {
        require(playToEarnServiceAddress != address(0), "Managers must set service address");
        require(msg.sender == playToEarnServiceAddress, "Not authorized");
        emit PlayerWithdraw(block.timestamp, _players, _amounts);
        uint256 _totalAmount;
        for (uint256 i = 0; i < _amounts.length; i++) {
            _totalAmount += _amounts[i];
        }
        _withdrawTokens(_players, _amounts, _totalAmount);
    }
}
