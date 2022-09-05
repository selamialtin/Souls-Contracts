// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IManagers.sol";
import "hardhat/console.sol";

contract Airdrop {
    IManagers managers;

    struct AirdropRecord {
        bytes32 merkleRootHash;
        uint256 totalAmount;
        uint256 startTime;
        uint256 endTime;
    }
    AirdropRecord[] public airdropRecords;

    mapping(uint256 => mapping(address => bool)) public claimRecords;

    uint256 public airdropRecordCount;
    address public soulsTokenAddress;

    constructor(address _managersAddress, address _soulsTokenAddress) {
        managers = IManagers(_managersAddress);
        soulsTokenAddress = _soulsTokenAddress;
    }

    modifier onlyManager() {
        require(managers.isManager(msg.sender), "ONLY MANAGERS: Not authorized");
        _;
    }

    function claimTokens(uint256 _amount, bytes32[] calldata _merkleProof) external {
        require(airdropRecordCount > 0, "There isn't any active airdrop");
        uint256 _airdropPeriod = airdropRecordCount - 1;
        AirdropRecord memory _currentAirdropRecord = airdropRecords[_airdropPeriod];
        require(block.timestamp >= _currentAirdropRecord.startTime, "Airdrop period didn't start yet");
        require(block.timestamp < _currentAirdropRecord.endTime, "Airdrop period has ended");

        bytes32 _leaf = keccak256(abi.encodePacked(msg.sender, _airdropPeriod, _amount));
        require(
            MerkleProof.verifyCalldata(_merkleProof, _currentAirdropRecord.merkleRootHash, _leaf),
            "There is no allocation for caller or wrong parameters"
        );
        require(!claimRecords[_airdropPeriod][msg.sender], "Already claimed");
        claimRecords[_airdropPeriod][msg.sender] = true;
        require(IERC20(soulsTokenAddress).transfer(msg.sender, _amount));
    }

    //Managers Function
    function createNewAirdrop(
        bytes32 _merkleRootHash,
        uint256 _totalAmount,
        uint256 _startTime,
        uint256 _endTime
    ) external onlyManager {
        require(_merkleRootHash.length > 0, "Invalid merkle root");
        require(_startTime > block.timestamp, "Start time must be in the future");
        require(_endTime > _startTime, "End time must be later than start time");
        if (airdropRecordCount > 0) {
            require(
                block.timestamp > airdropRecords[airdropRecords.length - 1].endTime,
                "Current period didn't finish yet"
            );
        }
        require(_totalAmount > 0, "Total amount cannot be zero");
        require(
            IERC20(soulsTokenAddress).balanceOf(address(this)) >= _totalAmount,
            "Not enough balance in airdrop contract"
        );

        string memory _title = "Create new airdrop";
        bytes memory _valueInBytes = abi.encode(_merkleRootHash, _totalAmount, _startTime, _endTime);
        managers.approveTopic(_title, _valueInBytes);
        if (managers.isApproved(_title, _valueInBytes)) {
            airdropRecords.push(
                AirdropRecord({
                    merkleRootHash: _merkleRootHash,
                    totalAmount: _totalAmount,
                    startTime: _startTime,
                    endTime: _endTime
                })
            );
            airdropRecordCount++;
            managers.deleteTopic(_title);
        }
    }
}
