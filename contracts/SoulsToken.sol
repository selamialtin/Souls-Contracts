// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IManagers.sol";
import "./interfaces/IBotPrevention.sol";
import "hardhat/console.sol";



contract SoulsToken is ERC20Burnable, Ownable {
    IBotPrevention botPrevention;
    IManagers managers; 
    uint256 constant public maxSupply = 3000000000 ether;
    bool public botPreventionEnabled = true; 

    constructor(
        string memory _name,
        string memory _symbol,
        address _managers,
        address _botPrevention
    ) ERC20(_name, _symbol) {
        botPrevention = IBotPrevention(_botPrevention);
        managers = IManagers(_managers);
        _mint(msg.sender, maxSupply);
    }

    modifier onlyManager() {
        require(managers.isManager(msg.sender), "ONLY MANAGERS: Not authorized");
        _;
    }

	
    function disableBotPrevention() external onlyManager {
        require(botPreventionEnabled, "Already disabled");
        string memory _title = "Set Bot Prevention Status";
        bytes memory _valueInBytes = abi.encode(0);
        managers.approveTopic(_title, _valueInBytes);
        if (managers.isApproved(_title, _valueInBytes)) {
            botPreventionEnabled = false;
            managers.deleteTopic(_title);
        }
    }

    function enableBotPrevention() external onlyManager {
        require(!botPreventionEnabled, "Already enabled");
        string memory _title = "Set Bot Prevention Status";
        bytes memory _valueInBytes = abi.encode(0);
        managers.approveTopic(_title, _valueInBytes);
        if (managers.isApproved(_title, _valueInBytes)) {
            botPreventionEnabled = true;
            managers.deleteTopic(_title);
        }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal view override {
        if (botPreventionEnabled) {
           require( botPrevention.beforeTokenTransfer(from, to, amount), "Bot prevention error");
        }
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        if (botPreventionEnabled) {
           require( botPrevention.afterTokenTransfer(from, to, amount), "Bot prevention error");
        }
    }
}
