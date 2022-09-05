// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "./interfaces/IManagers.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract BotPrevention is Ownable {
    struct BotProtectionParams {
        uint256 activateIfBalanceExeeds;
        uint256 maxSellAmount;
        uint256 durationBetweenSells;
    }
    IManagers managers;

    BotProtectionParams public botProtectionParams;

    address public tokenAddress;
    uint256 public tradingStartTimeOnDEX;
    uint256 public botPreventionDuration = 0; //Will be set in enableTrading function
    address public dexPairAddress;
    bool public tradingEnabled = false;

    mapping(address => uint256) public walletCanSellAfter;
    mapping(address => uint256) private boughtAmountDuringBotProtection;

    constructor() {
        //TODO: Decide the parameter values for bot protection
        botProtectionParams = BotProtectionParams({
            activateIfBalanceExeeds: 10000 ether,
            maxSellAmount: 1000 ether,
            durationBetweenSells: 10 minutes
        });
    }

    modifier onlyManager() {
        require(managers.isManager(msg.sender), "ONLY MANAGERS: Not authorized");
        _;
    }

    function setTokenAddress(address _tokenAddress) external onlyOwner {
        require(_tokenAddress != address(0), "Zero address");
        require(tokenAddress == address(0), "Token address has already set before");
        tokenAddress = _tokenAddress;
    }

    function setManagersAddress(address _address) external onlyOwner {
        require(_address != address(0), "Zero address");
        managers = IManagers(_address);
    }

    //Managers function
    function enableTrading(uint256 _tradingStartTime, uint256 _botPreventionDurationInMinutes) external onlyManager {
        require(tokenAddress != address(0), "Set token address first");
        require(!tradingEnabled, "Already enabled");
        string memory _title = "Enable/Disable Trading";
        bytes memory _valueInBytes = abi.encode(true, _tradingStartTime, _botPreventionDurationInMinutes);
        managers.approveTopic(_title, _valueInBytes);
        if (managers.isApproved(_title, _valueInBytes)) {
            tradingEnabled = true;
            tradingStartTimeOnDEX = _tradingStartTime;
            botPreventionDuration = _botPreventionDurationInMinutes * 1 minutes;
            managers.deleteTopic(_title);
        }
    }

    //Managers function
    /// @notice To disable trading on DEX in case of security problem.
    function disableTrading() external onlyManager {
        require(tradingEnabled, "Already disabled");
        string memory _title = "Enable/Disable Trading";
        bytes memory _valueInBytes = abi.encode(false,0,0);
        managers.approveTopic(_title, _valueInBytes);

        if (managers.isApproved(_title, _valueInBytes)) {
            tradingEnabled = false;
            managers.deleteTopic(_title);
        }
    }

    function setDexPairAddress(address _pairAddress) external onlyOwner {
        require(dexPairAddress == address(0), "Already set"); //Cannot change after initialization
        require(_pairAddress != address(0), "Cannot set to zero address");
        dexPairAddress = _pairAddress;
        tradingEnabled = false;
    }

    function beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) external view returns (bool) {
        if (((dexPairAddress != address(0) && (from == dexPairAddress)) || to == dexPairAddress)) {
            //Trade transaction
            require(tradingEnabled, "Trading is disabled");
            require(block.timestamp > tradingStartTimeOnDEX, "Trading not started");
            if (block.timestamp < tradingStartTimeOnDEX + botPreventionDuration) {
                //While bot protection is active
                if (to == dexPairAddress) {
                    //Selling Souls
                    require(block.timestamp > walletCanSellAfter[from], "Bot protection time lock");
                    if (walletCanSellAfter[from] > 0) {
                        require(amount <= botProtectionParams.maxSellAmount, "Bot protection amount lock");
                    }
                }
            }
        }
        return true;
    }

    function afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) external returns (bool) {
        if (dexPairAddress != address(0) && block.timestamp < tradingStartTimeOnDEX + botPreventionDuration) {
            if (from == dexPairAddress) {
                //Buying Tokens
                if (
                    block.timestamp > tradingStartTimeOnDEX &&
                    block.timestamp < tradingStartTimeOnDEX + botPreventionDuration
                ) {
                    boughtAmountDuringBotProtection[to] += amount;
                }
                if (boughtAmountDuringBotProtection[to] > botProtectionParams.activateIfBalanceExeeds) {
                    //Start following account
                    walletCanSellAfter[to] = block.timestamp + botProtectionParams.durationBetweenSells;
                }
            }
            if (to == dexPairAddress) {
                //Selling Tokens

                if (
                    block.timestamp > tradingStartTimeOnDEX &&
                    block.timestamp < tradingStartTimeOnDEX + botPreventionDuration
                ) {
                    if (boughtAmountDuringBotProtection[from] >= amount) {
                        boughtAmountDuringBotProtection[from] -= amount;
                    }
                }
                if (walletCanSellAfter[from] > 0) {
                    //Account is followed by bot protection
                    walletCanSellAfter[from] = block.timestamp + botProtectionParams.durationBetweenSells;
                }
            } else {
                //standard transfer
                if (IERC20(tokenAddress).balanceOf(to) > botProtectionParams.activateIfBalanceExeeds) {
                    //Start following account

                    walletCanSellAfter[to] = block.timestamp + botProtectionParams.durationBetweenSells;
                }
            }
        }
        return true;
    }
}
