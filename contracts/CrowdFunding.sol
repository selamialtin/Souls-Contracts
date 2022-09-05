// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "./interfaces/IManagers.sol";
import "./interfaces/ICrowdFunding.sol";
import {TokenReward, ICrowdFunding} from "./interfaces/ICrowdFunding.sol";
import "hardhat/console.sol";

contract CrowdFunding is Pausable, Ownable, ERC165 {
    IManagers managers;
    IERC20 public soulsToken;

    struct Investor {
        uint256 totalAmount;
        uint256 vestingCount;
        uint256 currentVestingIndex;
        uint256 blacklistDate;
    }

    mapping(address => TokenReward[]) public tokenRewards;
    mapping(address => Investor) public investors;

    address[] public investorList;

    /**
	@dev must be assigned in constructor one of these: 
	"Strategic Sale", "Seed Sale", "Private Sale", or "Public Sale" 
	*/
    string public crowdFundingType;

    uint256 public totalCap;
    uint256 public totalRewardAmount;
    uint256 public totalClaimedAmount;

    event BalanceWithdraw(address sender, uint256 amount);

    constructor(
        string memory _crowdFundingType,
        uint256 _totalCap,
        address _soulsTokenAddress,
        address _managersAddress
    ) {
        require(
            keccak256(abi.encodePacked(_crowdFundingType)) == keccak256(abi.encodePacked("Strategic Sale")) ||
                keccak256(abi.encodePacked(_crowdFundingType)) == keccak256(abi.encodePacked("Seed Sale")) ||
                keccak256(abi.encodePacked(_crowdFundingType)) == keccak256(abi.encodePacked("Private Sale")) ||
                keccak256(abi.encodePacked(_crowdFundingType)) == keccak256(abi.encodePacked("Public Sale")),
            "Invalid crowdfunding type"
        );
        require(_totalCap > 0, "Total cap cannot be zero");
        require(_soulsTokenAddress != address(0) && _managersAddress != address(0), "Zero address in parameters");
        crowdFundingType = _crowdFundingType;
        soulsToken = IERC20(_soulsTokenAddress);
        managers = IManagers(_managersAddress);
        totalCap = _totalCap;
    }

    modifier ifNotBlacklisted(uint256 _time) {
        require(!isInBlacklist(msg.sender, _time), "Address is blacklisted");
        _;
    }

    modifier onlyManager() {
        require(managers.isManager(msg.sender), "ONLY MANAGERS: Not authorized");
        _;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(ICrowdFunding).interfaceId;
    }

    /// @dev number of vestings for each owner must be one below of total vesting because of advance paymant and
    /// amount per vesting for each owner must be calculated with subtraction of advance amount from total amount.
    function addRewards(
        address[] memory _rewardOwners,
        uint256[] memory _advanceAmountPerAddress,
        uint256[] memory _totalOfVestings, //excluding advance amount
        uint8 _vestingCount, // excluding advance payment
        uint256 _advanceReleaseDate,
        uint256 _vestingStartDate,
        address _tokenHolder
    ) public onlyOwner whenNotPaused {
        require(
            _rewardOwners.length == _advanceAmountPerAddress.length && _rewardOwners.length == _totalOfVestings.length,
            "Invalid data"
        );
        require(_advanceReleaseDate > block.timestamp, "Advance release date is in the past");
        require(_vestingStartDate > _advanceReleaseDate, "Release date is before advance relase date");
        uint256 _totalAmount = 0;
        for (uint256 r = 0; r < _rewardOwners.length; r++) {
            address _rewardOwner = _rewardOwners[r];
            require(investors[_rewardOwner].totalAmount == 0, "Investor already added");

            uint256 _advanceAmount = _advanceAmountPerAddress[r];
            uint256 _investorTotalAmount = _advanceAmount;
            console.log("a");
            if (_advanceAmount > 0) {
                tokenRewards[_rewardOwner].push(
                    TokenReward({
                        amount: _advanceAmount,
                        releaseDate: _advanceReleaseDate,
                        isClaimed: false,
                        isActive: true
                    })
                );
            }
            console.log("b");

            for (uint8 i = 0; i < _vestingCount; i++) {
                console.log("c1");
                console.log("amount: %s", _totalOfVestings[r] / _vestingCount);
                console.log("vesting start date: %s", (30 days * i));
                console.log("vesting date: %s", _vestingStartDate + (30 days * i));
                tokenRewards[_rewardOwner].push(
                    TokenReward({
                        amount: _totalOfVestings[r] / _vestingCount,
                        releaseDate: _vestingStartDate + (30 days * i),
                        isClaimed: false,
                        isActive: true
                    })
                );

                _investorTotalAmount += tokenRewards[_rewardOwner][i].amount;
                console.log("c2");
            }
            _totalAmount += _investorTotalAmount;
            console.log("d");

            investors[_rewardOwner] = Investor({
                totalAmount: _investorTotalAmount,
                vestingCount: _advanceAmount > 0 ? (_vestingCount + 1) : _vestingCount,
                currentVestingIndex: 0,
                blacklistDate: 0
            });
            console.log("e");

            investorList.push(_rewardOwner);
        }
        totalRewardAmount += _totalAmount;
        require(totalRewardAmount <= totalCap, "Total reward amount exceeds total cap of contract");
        require(soulsToken.transferFrom(_tokenHolder, address(this), _totalAmount));
        console.log("f");
    }

    function claimTokens(uint8 _vestingIndex)
        public
        whenNotPaused
        ifNotBlacklisted(tokenRewards[msg.sender][_vestingIndex].releaseDate)
    {
        require(_vestingIndex == investors[msg.sender].currentVestingIndex);
        require(
            tokenRewards[msg.sender][_vestingIndex].releaseDate > 0 &&
                tokenRewards[msg.sender][_vestingIndex].releaseDate < block.timestamp,
            "Early request"
        );
        require(!tokenRewards[msg.sender][_vestingIndex].isClaimed, "Reward is already claimed");
        require(tokenRewards[msg.sender][_vestingIndex].isActive, "Reward is deactivated");
        tokenRewards[msg.sender][_vestingIndex].isClaimed = true;
        investors[msg.sender].currentVestingIndex++;
        totalClaimedAmount += tokenRewards[msg.sender][_vestingIndex].amount;
        require(
            soulsToken.transfer(msg.sender, tokenRewards[msg.sender][_vestingIndex].amount),
            "Token transfer error"
        );
    }

    //Managers Function
    function deactivateInvestorVesting(
        address _rewardOwner,
        uint8 _vestingIndex,
        address _tokenReceiver
    ) external onlyManager {
        require(_rewardOwner != address(0), "Zero address");
        require(tokenRewards[_rewardOwner].length > 0, "Reward owner not found");
        require(_vestingIndex < investors[_rewardOwner].vestingCount, "Invalid vesting index");
        require(!tokenRewards[_rewardOwner][_vestingIndex].isClaimed, "Already claimed");
        require(tokenRewards[_rewardOwner][_vestingIndex].isActive, "Already deactive");

        string memory _title = "Deactivate Investor Rewards";
        bytes memory _valueInBytes = abi.encode(_rewardOwner, _vestingIndex);

        managers.approveTopic(_title, _valueInBytes);
        if (managers.isApproved(_title, _valueInBytes)) {
            tokenRewards[_rewardOwner][_vestingIndex].isActive = false;
            require(
                soulsToken.transfer(_tokenReceiver, tokenRewards[_rewardOwner][_vestingIndex].amount),
                "Token transfer error"
            );
            managers.deleteTopic(_title);
        }
    }

    //Managers Function
    function activateInvestorVesting(
        address _rewardOwner,
        uint8 _vestingIndex,
        address _tokenSource
    ) external onlyManager {
        require(_rewardOwner != address(0), "Zero address");
        require(tokenRewards[_rewardOwner].length > 0, "Reward owner not found");
        require(_vestingIndex < investors[_rewardOwner].vestingCount, "Invalid vesting index");
        require(!tokenRewards[_rewardOwner][_vestingIndex].isActive, "Already active");

        string memory _title = "Activate Investor Rewards";
        bytes memory _valueInBytes = abi.encode(_rewardOwner, _vestingIndex);

        managers.approveTopic(_title, _valueInBytes);
        if (managers.isApproved(_title, _valueInBytes)) {
            tokenRewards[_rewardOwner][_vestingIndex].isActive = true;
            require(
                soulsToken.transferFrom(_tokenSource, address(this), tokenRewards[_rewardOwner][_vestingIndex].amount),
                "Token transfer error"
            );
            managers.deleteTopic(_title);
        }
    }

    //Managers Function
    function addToBlacklist(address _rewardOwner, address _tokenReceiver) external onlyManager {
        require(_rewardOwner != address(0), "Zero address");
        require(tokenRewards[_rewardOwner].length > 0, "Reward owner not found");
        require(!isInBlacklist(_rewardOwner, block.timestamp), "Already blacklisted");

        string memory _title = "Add To Blacklist";
        bytes memory _valueInBytes = abi.encode(_rewardOwner);

        managers.approveTopic(_title, _valueInBytes);
        if (managers.isApproved(_title, _valueInBytes)) {
            uint256 _remainingAmount = 0;
            for (uint256 i = 0; i < tokenRewards[_rewardOwner].length; i++) {
                if (tokenRewards[_rewardOwner][i].releaseDate > block.timestamp) {
                    _remainingAmount += tokenRewards[_rewardOwner][i].amount;
                }
            }
            require(soulsToken.transfer(_tokenReceiver, _remainingAmount), "Token transfer error");
            investors[_rewardOwner].blacklistDate = block.timestamp;
            managers.deleteTopic(_title);
        }
    }

    //Managers Function
    function removeFromBlacklist(address _rewardOwner, address _tokenSource) external onlyManager {
        require(_rewardOwner != address(0), "Zero address");
        require(isInBlacklist(_rewardOwner, block.timestamp), "Not blacklisted");

        string memory _title = "Remove From Blacklist";
        bytes memory _valueInBytes = abi.encode(_rewardOwner);
        managers.approveTopic(_title, _valueInBytes);
        if (managers.isApproved(_title, _valueInBytes)) {
            uint256 _requiredAmount;
            for (uint256 i = 0; i < tokenRewards[_rewardOwner].length; i++) {
                if (tokenRewards[_rewardOwner][i].releaseDate > investors[_rewardOwner].blacklistDate) {
                    _requiredAmount += tokenRewards[_rewardOwner][i].amount;
                }
            }
            require(soulsToken.transferFrom(_tokenSource, address(this), _requiredAmount), "Token transfer error");
            investors[_rewardOwner].blacklistDate = 0;
            managers.deleteTopic(_title);
        }
    }

    function getVestingInfo(uint8 _vestingIndex) public view returns (TokenReward memory) {
        return getVestingInfoForAccount(msg.sender, _vestingIndex);
    }

    function getVestingInfoForAccount(address _rewardOwner, uint8 _vestingIndex)
        public
        view
        returns (TokenReward memory)
    {
        return tokenRewards[_rewardOwner][_vestingIndex];
    }

    function getAllVestingInfoForAccount(address _rewardOwner) public view returns (TokenReward[] memory _returnData) {
        uint256 _vestingCount = investors[_rewardOwner].vestingCount;
        _returnData = new TokenReward[](_vestingCount);
        for (uint256 i = 0; i < _returnData.length; i++) {
            _returnData[i] = tokenRewards[_rewardOwner][i];
        }
    }

    function isInBlacklist(address _address, uint256 _time) public view returns (bool) {
        return investors[_address].blacklistDate != 0 && investors[_address].blacklistDate < _time;
    }

    function getTotalBalance() public view returns (uint256) {
        return soulsToken.balanceOf(address(this));
    }
}
