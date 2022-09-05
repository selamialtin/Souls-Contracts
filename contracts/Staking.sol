// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./interfaces/IManagers.sol";
import "hardhat/console.sol";

contract Staking is Pausable {
    IManagers managers;
    ERC20Burnable public tokenContract;

    uint256 public minimumStakingAmount = 10000 ether;
    uint256 public constant monthToSecond = 30 days;
    uint256 public constant yearToSecond = 365 days;
    uint256 public totalStakedAmount;
    uint256 public totalWithdrawnAmount;
    uint256 public totalBurnedAmount;

    uint256 public totalDistributedReward;

    uint256 public stakePercentagePer1Month;
    uint256 public stakePercentagePer3Month;
    uint256 public stakePercentagePer6Month;
    uint256 public stakePercentagePer12Month;

    address[] public stakers;

    struct StakeData {
        uint256 amount;
        uint256 stakeDate;
        uint256 releaseDate;
        uint256 percentage;
        uint16 monthToStake;
        bool withdrawn;
        uint256 withdrawTime;
    }

    mapping(address => StakeData[]) public stakes;
    mapping(address => bool) public isStaker;

    event Stake(address indexed sender, uint256 amount, uint256 stakeDate, uint256 releaseDate);
    event Withdraw(address indexed sender, uint256 amount, uint256 stakeDate);
    event EmergencyWithdraw(address indexed sender, uint256 amount, uint256 stakeDate);

    modifier onlyManager() {
        require(managers.isManager(msg.sender), "ONLY MANAGERS: Not authorized");
        _;
    }

    constructor(
        address _tokenContractAddress,
        address _managersContractAddress,
        uint256 _stakePercentagePer1Month,
        uint256 _stakePercentagePer3Month,
        uint256 _stakePercentagePer6Month,
        uint256 _stakePercentagePer12Month
    ) {
        tokenContract = ERC20Burnable(_tokenContractAddress);
        managers = IManagers(_managersContractAddress);
        stakePercentagePer1Month = _stakePercentagePer1Month;
        stakePercentagePer3Month = _stakePercentagePer3Month;
        stakePercentagePer6Month = _stakePercentagePer6Month;
        stakePercentagePer12Month = _stakePercentagePer12Month;
    }

    function getTotalBalance() public view returns (uint256) {
        return tokenContract.balanceOf(address(this));
    }

    //Managers Function
    function pause() external onlyManager {
        string memory _title = "Pause Staking Contract";
        bytes memory _valueInBytes = abi.encode(true);
        managers.approveTopic(_title, _valueInBytes);

        if (managers.isApproved(_title, _valueInBytes)) {
            _pause();
            emit Paused(msg.sender);
            managers.deleteTopic(_title);
        }
    }

    //Managers Function
    function unpause() external onlyManager {
        string memory _title = "Unpause Staking Contract";
        bytes memory _valueInBytes = abi.encode(true);
        managers.approveTopic(_title, _valueInBytes);

        if (managers.isApproved(_title, _valueInBytes)) {
            _unpause();
            emit Unpaused(msg.sender);
            managers.deleteTopic(_title);
        }
    }

    //Managers Function
    function changeStakeAPYrates(
        uint256 _newPercentagePer1Month,
        uint256 _newPercentagePer3Month,
        uint256 _newPercentagePer6Month,
        uint256 _newPercentagePer12Month
    ) external onlyManager {
        string memory _title = "Change Stake APY Rates";
        bytes memory _valueInBytes = abi.encode(
            _newPercentagePer1Month,
            _newPercentagePer3Month,
            _newPercentagePer6Month,
            _newPercentagePer12Month
        );
        managers.approveTopic(_title, _valueInBytes);

        if (managers.isApproved(_title, _valueInBytes)) {
            stakePercentagePer1Month = _newPercentagePer1Month;
            stakePercentagePer3Month = _newPercentagePer3Month;
            stakePercentagePer6Month = _newPercentagePer6Month;
            stakePercentagePer12Month = _newPercentagePer12Month;
            managers.deleteTopic(_title);
        }
    }

    //Managers Function
    function changeMinimumStakingAmount(uint256 _newAmount) external onlyManager {
        string memory _title = "Change Emergency Exit Penalty Rate";
        bytes memory _valueInBytes = abi.encode(_newAmount);
        managers.approveTopic(_title, _valueInBytes);

        if (managers.isApproved(_title, _valueInBytes)) {
            minimumStakingAmount = _newAmount;
            managers.deleteTopic(_title);
        }
    }

    function stake(uint256 _amount, uint8 _monthToStake) public whenNotPaused {
        require(_amount >= minimumStakingAmount, "Amount must be greater than minimum staking amount");
        require(
            _monthToStake == 1 || _monthToStake == 3 || _monthToStake == 6 || _monthToStake == 12,
            "Invalid staking duraiton"
        );

        //_amount will send to contract balance
        require(tokenContract.transferFrom(msg.sender, address(this), _amount), "Token transfer error");

        //Calculations of stakePercentage and release dates for different time ranges
        uint256 stakePercentage = stakePercentagePer1Month;

        if (_monthToStake == 3) {
            stakePercentage = stakePercentagePer3Month;
        } else if (_monthToStake == 6) {
            stakePercentage = stakePercentagePer6Month;
        } else if (_monthToStake == 12) {
            stakePercentage = stakePercentagePer12Month;
        }

        StakeData memory stakeDetails = StakeData({
            amount: _amount,
            stakeDate: block.timestamp,
            percentage: stakePercentage,
            monthToStake: _monthToStake,
            releaseDate: block.timestamp + (_monthToStake * monthToSecond),
            withdrawn: false,
            withdrawTime: 0
        });

        //stakes array for access to my stakeDetails array
        stakes[msg.sender].push(stakeDetails);
        totalStakedAmount += _amount;

        if (!isStaker[msg.sender]) {
            stakers.push(msg.sender);
            isStaker[msg.sender] = true;
        }

        emit Stake(msg.sender, _amount, stakeDetails.stakeDate, stakeDetails.releaseDate);
    }

    function fetchStakeDataForAddress(address _address) public view returns (StakeData[] memory) {
        return stakes[_address];
    }

    function fetchOwnStakeData() public view returns (StakeData[] memory) {
        return stakes[msg.sender];
    }

    function emergencyWithdrawStake(uint256 _stakeIndex) external {
        require(!stakes[msg.sender][_stakeIndex].withdrawn, "Stake already withdrawn");
        require(block.timestamp < stakes[msg.sender][_stakeIndex].releaseDate, "Can withdraw normal");
        stakes[msg.sender][_stakeIndex].withdrawn = true;
        stakes[msg.sender][_stakeIndex].withdrawTime = block.timestamp;

        (uint256 _totalAmount, uint256 _emergencyExitPenalty) = fetchStakeRewardForAddress(msg.sender, _stakeIndex);

        uint256 _amountAfterPenalty = _totalAmount - _emergencyExitPenalty;

        require(tokenContract.transfer(msg.sender, _amountAfterPenalty), "Token transfer error");

        //Burn penalty tokens
        tokenContract.burn(_emergencyExitPenalty);

        totalBurnedAmount += _emergencyExitPenalty;
        totalWithdrawnAmount += _amountAfterPenalty;
        totalDistributedReward += _amountAfterPenalty > stakes[msg.sender][_stakeIndex].amount
            ? (_amountAfterPenalty - stakes[msg.sender][_stakeIndex].amount)
            : 0;
        totalStakedAmount -= _amountAfterPenalty > stakes[msg.sender][_stakeIndex].amount
            ? (stakes[msg.sender][_stakeIndex].amount)
            : _amountAfterPenalty;

        emit EmergencyWithdraw(msg.sender, _amountAfterPenalty, block.timestamp);
    }

    function withdrawStake(uint256 _stakeIndex) external {
        require(!stakes[msg.sender][_stakeIndex].withdrawn, "Stake already withdrawn");
        require(block.timestamp >= stakes[msg.sender][_stakeIndex].releaseDate, "Early request");
        stakes[msg.sender][_stakeIndex].withdrawn = true;
        stakes[msg.sender][_stakeIndex].withdrawTime = block.timestamp;

        (uint256 _totalAmount, ) = fetchStakeRewardForAddress(msg.sender, _stakeIndex);

        require(tokenContract.transfer(msg.sender, _totalAmount), "Token transfer error");

        totalStakedAmount -= stakes[msg.sender][_stakeIndex].amount;
        totalWithdrawnAmount += _totalAmount;
        totalDistributedReward += _totalAmount - stakes[msg.sender][_stakeIndex].amount;

        emit Withdraw(msg.sender, _totalAmount, block.timestamp);
    }

    function fetchStakeRewardForAddress(address _address, uint256 _stakeIndex)
        public
        view
        returns (uint256 _totalAmount, uint256 _penaltyAmount)
    {
        bool _hasPenalty = block.timestamp < stakes[_address][_stakeIndex].releaseDate;

        uint256 rewardEarningEndTime = _hasPenalty ? block.timestamp : stakes[_address][_stakeIndex].releaseDate;

        uint256 _dateDiff = rewardEarningEndTime - stakes[_address][_stakeIndex].stakeDate;

        _totalAmount =
            stakes[_address][_stakeIndex].amount +
            ((stakes[_address][_stakeIndex].amount * stakes[_address][_stakeIndex].percentage * _dateDiff) /
                (yearToSecond * 100 ether));

        if (_hasPenalty) {
            uint256 actualPenaltyRate = stakes[msg.sender][_stakeIndex].percentage -
                ((stakes[msg.sender][_stakeIndex].percentage * _dateDiff) /
                    (stakes[msg.sender][_stakeIndex].monthToStake * monthToSecond));

            _penaltyAmount = (_totalAmount * actualPenaltyRate) / 100 ether;
        }
    }

    function fetchStakeReward(uint256 _stakeIndex)
        external
        view
        returns (uint256 _totalAmount, uint256 _penaltyAmount)
    {
        (_totalAmount, _penaltyAmount) = fetchStakeRewardForAddress(msg.sender, _stakeIndex);
    }

    function fetchStakers() public view returns (address[] memory) {
        return stakers;
    }
}
