// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IManagers.sol";
import "hardhat/console.sol";

contract Vault {
    IManagers managers;
    address public soulsTokenAddress;
    address public proxyAddress;

    uint256 public releasedAmount;
    uint256 public currentVestingIndex;
    uint256 public totalWithdrawnAmount;
    /**
	@dev must be assigned in constructor on of these: 
	"Marketing", "Advisor", "Airdrop", "Exchanges", "Treasury" or "Team"
	 */
    string public vaultName;

    struct LockedToken {
        uint256 amount;
        uint256 unlockTime;
        bool released;
    }

    LockedToken[] public tokenVestings;
    //    mapping(uint256 => LockedToken) public tokenVestings;

    event Withdraw(uint256 indexed date, uint256 indexed amount);
    event ReleaseVesting(uint256 indexed date, uint256 indexed vestingIndex);
    event DepositTokens(uint256 indexed date, uint256 _amount);

    modifier onlyOnce() {
        require(tokenVestings.length == 0, "Only once function was called before");
        _;
    }
    modifier onlyProxy() {
        require(msg.sender == proxyAddress, "ONLY PROXY: Not authorized");
        _;
    }

    modifier onlyManager() {
        require(managers.isManager(msg.sender), "ONLY MANAGERS: Not authorized");
        _;
    }

    constructor(
        string memory _vaultName,
        address _proxyAddress,
        address _soulsTokenAddress,
        address _managersAddress
    ) {
        require(_proxyAddress != address(0), "Invalid proxy address");
        require(_managersAddress != address(0), "Invalid managers address");
        require(_soulsTokenAddress != address(0), "Invalid token address");
        vaultName = _vaultName;
        proxyAddress = _proxyAddress;
        soulsTokenAddress = _soulsTokenAddress;
        managers = IManagers(_managersAddress);
    }

    function lockTokens(
        uint256 _totalAmount,
        uint256 _initialRelease,
        uint256 _lockDurationInDays,
        uint256 _countOfVestings,
        uint256 _releaseFrequencyInDays
    ) public virtual onlyOnce onlyProxy {
        require(_totalAmount > 0, "Zero amount");
        require(_countOfVestings > 0, "Invalid vesting count");
        if (_countOfVestings != 1) {
            require(_releaseFrequencyInDays > 0, "Invalid frequency");
        }

        IERC20 _soulsToken = IERC20(soulsTokenAddress);
        require(_soulsToken.transferFrom(msg.sender, address(this), _totalAmount), "Token transfer error");

        uint256 _amountUsed = 0;

        if (_initialRelease > 0) {
            tokenVestings.push(LockedToken({amount: _initialRelease, unlockTime: block.timestamp, released: false}));
            _amountUsed += _initialRelease;
        }
        uint256 lockDuration = _lockDurationInDays * 1 days;
        uint256 releaseFrequency = _releaseFrequencyInDays * 1 days;
        for (uint256 i = 0; i < _countOfVestings; i++) {
            uint256 _amount = (_totalAmount - _initialRelease) / _countOfVestings;
            if (i == _countOfVestings - 1) {
                _amount = _totalAmount - _amountUsed; //use remaining dusts from division
            }
            tokenVestings.push(
                LockedToken({
                    amount: _amount,
                    unlockTime: block.timestamp + lockDuration + (i * releaseFrequency),
                    released: false
                })
            );
            _amountUsed += _amount;
        }
    }

	//TODO: test this function
    //Managers function
    function depositTokens(uint256 _amount, address _tokenHolder) external onlyManager {
        require(_amount > 0, "Amount cannot be zero");
        require(_tokenHolder != address(0), "Token holder address cannot be zero");

        string memory _title = string.concat("Deposit tokens to ", vaultName, " Vault");

        bytes memory _valueInBytes = abi.encode(_amount, _tokenHolder);
        managers.approveTopic(_title, _valueInBytes);

        if (managers.isApproved(_title, _valueInBytes)) {
            releasedAmount += _amount;
            require(
                IERC20(soulsTokenAddress).transferFrom(_tokenHolder, address(this), _amount),
                "Transfer from error"
            );
            emit DepositTokens(block.timestamp, _amount);
            managers.deleteTopic(_title);
        }
    }

    //Managers function
    function withdrawTokens(address[] calldata _receivers, uint256[] calldata _amounts) external virtual onlyManager {
        require(_receivers.length == _amounts.length, "Receivers and Amounts must be in same size");
        uint256 _totalAmount;
        for (uint256 i = 0; i < _amounts.length; i++) {
            _totalAmount += _amounts[i];
        }
        emit Withdraw(block.timestamp, _totalAmount);
        _withdrawTokens(_receivers, _amounts, _totalAmount);
    }

    function _withdrawTokens(
        address[] memory _receivers,
        uint256[] memory _amounts,
        uint256 _totalAmount
    ) internal {
        uint256 _tmpTotalAmount = 0;
        for (uint256 a = 0; a < _amounts.length; a++) {
            require(_amounts[a] > 0, "Zero token amount in data");
            _tmpTotalAmount += _amounts[a];
        }
        require(_tmpTotalAmount == _totalAmount, "Total of amounts array is not equal with total amount");

        if (_totalAmount > releasedAmount - totalWithdrawnAmount) {
            require(currentVestingIndex < tokenVestings.length, "Not enough released tokens and no more vesting");
            require(
                block.timestamp >= tokenVestings[currentVestingIndex].unlockTime,
                "Wait for next vesting release date"
            );
            require(
                tokenVestings[currentVestingIndex].amount + releasedAmount - totalWithdrawnAmount >= _totalAmount,
                "Not enough amount in released balance"
            );
        }

        string memory _title = string.concat("Withdraw Tokens From ", vaultName, " Vault");

        bytes memory _valueInBytes = abi.encode(_receivers, _amounts);
        managers.approveTopic(_title, _valueInBytes);

        if (managers.isApproved(_title, _valueInBytes)) {
            if (_totalAmount > releasedAmount - totalWithdrawnAmount) {
                //Needs to release new vesting
                currentVestingIndex++;
                tokenVestings[currentVestingIndex - 1].released = true;
                releasedAmount += tokenVestings[currentVestingIndex - 1].amount;
                emit ReleaseVesting(block.timestamp, currentVestingIndex - 1);
            }

            IERC20 _soulsToken = IERC20(soulsTokenAddress);
            for (uint256 r = 0; r < _receivers.length; r++) {
                address _receiver = _receivers[r];
                uint256 _amount = _amounts[r];

                require(_soulsToken.transfer(_receiver, _amount), "Token transfer error");
            }
            totalWithdrawnAmount += _totalAmount;
            managers.deleteTopic(_title);
        }
    }

    function getVestingData() public view returns (LockedToken[] memory) {
        return tokenVestings;
    }

    function getAvailableAmountForWithdraw() public view returns (uint256 _amount) {
        _amount = releasedAmount - totalWithdrawnAmount;
        if (
            currentVestingIndex < tokenVestings.length &&
            block.timestamp >= tokenVestings[currentVestingIndex].unlockTime &&
            !tokenVestings[currentVestingIndex].released
        ) {
            _amount += tokenVestings[currentVestingIndex].amount;
        }
    }

    //TODO extra deposit functionfor play2earn
}
