// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "./interfaces/IVault.sol";
import "./interfaces/ILiquidityVault.sol";
import "./interfaces/IStaking.sol";
import "./interfaces/ICrowdFunding.sol";
import "./interfaces/IBotPrevention.sol";
import "./Managers.sol";
import "./SoulsToken.sol";
import "hardhat/console.sol";

contract Proxy is Ownable {
    using ERC165Checker for address;
    SoulsToken public soulsToken;
    Managers public managers;

    uint256 public liquidityTokensUnlockTime;

    //Tokenomi
    uint256 public marketingShare = 300_000_000 ether;
    uint256 public exchangesShare = 150_000_000 ether;
    uint256 public liquidityShare = 60_000_000 ether;
    uint256 public stakingShare = 300_000_000 ether;
    uint256 public advisorShare = 150_000_000 ether;
    uint256 public airdropShare = 90_000_000 ether;
    uint256 public teamShare = 300_000_000 ether;
    uint256 public treasuryShare = 210_000_000 ether;
    uint256 public playToEarnShare = 900_000_000 ether;

    address public marketingVaultAddress;
    address public teamVaultAddress;
    address public advisorVaultAddress;
    address public airdropVaultAddress;
    address public exchangesVaultAddress;
    address public liquidityVaultAddress;
    address public playToEarnVaultAddress;
    address public treasuryVaultAddress;
    address public stakingAddress;
    address public dexPairAddress;

    enum VaultEnumerator {
        MARKETING,
        ADVISOR,
        AIRDROP,
        TEAM,
        EXCHANGES,
        TREASURY
    }

    modifier onlyManager() {
        require(managers.isManager(msg.sender), "ONLY MANAGERS: Not authorized");
        _;
    }

    constructor(
        address _manager1,
        address _manager2,
        address _manager3,
        address _manager4,
        address _manager5,
        address _botPreventionAddress
    ) {
        require(
            _manager1 != address(0) &&
                _manager2 != address(0) &&
                _manager3 != address(0) &&
                _manager4 != address(0) &&
                _manager5 != address(0)
        );
        managers = new Managers(_manager1, _manager2, _manager3, _manager4, _manager5);
        soulsToken = new SoulsToken("SOULS", "Souls Token", address(managers), _botPreventionAddress);
        managers.addAddressToTrustedSources(address(soulsToken), "Souls Token");
        managers.addAddressToTrustedSources(_botPreventionAddress, "Bot Prevention");
    }


    function initStakingContract(address _stakingAddress) external onlyOwner {
        require(stakingAddress == address(0), "Already Inited");
        require(_stakingAddress != address(0), "Zero address");
        stakingAddress = _stakingAddress;

        IStaking _staking = IStaking(stakingAddress);
        require(soulsToken.transfer(address(_staking), stakingShare));
        managers.addAddressToTrustedSources(stakingAddress, "Staking");
    }

    function approveTokensForCrowdFundingContract(address _crowdfundingContractAddress) external onlyManager {
        require(_crowdfundingContractAddress != address(0), "Zero address");
        string memory _title = "Approve Tokens for Crowd Funding Contract";
        bytes memory _valueInBytes = abi.encode(_crowdfundingContractAddress);

        managers.approveTopic(_title, _valueInBytes);
        if (managers.isApproved(_title, _valueInBytes)) {
            soulsToken.approve(_crowdfundingContractAddress, type(uint256).max);
            managers.deleteTopic(_title);
        }
    }

    function initAirdropContract(address _airdropContractAddress) external onlyManager {
        require(_airdropContractAddress != address(0), "Zero address");
        string memory _title = "Init airdrop contract";
        bytes memory _valueInBytes = abi.encode(_airdropContractAddress);

        managers.approveTopic(_title, _valueInBytes);
        if (managers.isApproved(_title, _valueInBytes)) {
			managers.addAddressToTrustedSources(_airdropContractAddress,"Airdrop Contract");
            managers.deleteTopic(_title);
        }
    }

    //Managers Function
    function transferTokensToCrowdFundingContract(address _contractAddress, uint256 _totalAmount) external onlyManager {
        require(_contractAddress != address(0), "Zero address");
        require(_totalAmount > 0, "Zero amount");
        require(_contractAddress.supportsInterface(type(ICrowdFunding).interfaceId), "Not crowdfunding contract");

        string memory _title = "Transfer Tokens To Crowd Funding Contract";
        bytes memory _valueInBytes = abi.encode(_contractAddress, _totalAmount);
        managers.approveTopic(_title, _valueInBytes);
        if (managers.isApproved(_title, _valueInBytes)) {
            require(soulsToken.transfer(_contractAddress, _totalAmount), "Token transfer error");
            managers.deleteTopic(_title);
        }
    }

    //Managers Function
    function initPlayToEarnVault(address _playToEarnVaultAddress, uint256 _gameStartTime) external onlyManager {
        require(playToEarnVaultAddress == address(0), "Already Inited");
        require(_playToEarnVaultAddress != address(0), "Zero address");
        require(_gameStartTime < block.timestamp, "Game start time must be in the past");

        string memory _title = "Init Play To Earn Vault";
        bytes memory _valueInBytes = abi.encode(_gameStartTime);
        managers.approveTopic(_title, _valueInBytes);
        if (managers.isApproved(_title, _valueInBytes)) {
            playToEarnVaultAddress = _playToEarnVaultAddress;
            uint256 daysSinceGameStartTime = (block.timestamp - _gameStartTime) / 1 days;
            console.log("Days since game start: %s", daysSinceGameStartTime);
            require(60 - daysSinceGameStartTime >= 0, "Game start day can be maximum 60 days before");
            _initPlayToEarnVault(60 - daysSinceGameStartTime);
            managers.deleteTopic(_title);
        }
    }


    function initLiquidityVault(address _liquidityVaultAddress, address _BUSDTokenAddress) external onlyOwner {
        require(liquidityVaultAddress == address(0), "Already Inited");
        liquidityVaultAddress = _liquidityVaultAddress;

        ILiquidityVault _liquidityVault = ILiquidityVault(liquidityVaultAddress);

        IERC20 BUSDToken = IERC20(_BUSDTokenAddress);
        BUSDToken.approve(liquidityVaultAddress, type(uint256).max);
        soulsToken.approve(liquidityVaultAddress, liquidityShare);
        require(
            BUSDToken.transferFrom(msg.sender, liquidityVaultAddress, _liquidityVault.BUSDAmountForInitialLiquidity()),
            "Token transfer error"
        );

        _liquidityVault.lockTokens(liquidityShare);
        liquidityTokensUnlockTime = block.timestamp + 365 days;
        managers.addAddressToTrustedSources(liquidityVaultAddress, "Liquidity Vault");
        dexPairAddress = _liquidityVault.getDEXPairAddress();
    }

    function initVault(address _vaultAddress, VaultEnumerator _vaultToInit) external onlyOwner {
        string memory _vaultName;
        uint256 _vaultShare;
        uint256 _initialRelease;
        uint256 _cliffDuration;
        uint256 _vestingCount;
        uint256 _vestingFrequency;
        if (_vaultToInit == VaultEnumerator.MARKETING) {
            require(marketingVaultAddress == address(0), "Already Inited");
            require(_vaultAddress != address(0), "Zero address");
            marketingVaultAddress = _vaultAddress;
            _vaultName = "Marketing Vault";
            _vaultShare = marketingShare;
            _initialRelease = 6_000_000 ether;
            _cliffDuration = 90;
            _vestingCount = 24;
            _vestingFrequency = 30;
        } else if (_vaultToInit == VaultEnumerator.ADVISOR) {
            require(advisorVaultAddress == address(0), "Already Inited");
            require(_vaultAddress != address(0), "Zero address");
            advisorVaultAddress = _vaultAddress;
            _vaultName = "Advisor Vault";
            _vaultShare = advisorShare;
            _initialRelease = 0;
            _cliffDuration = 365;
            _vestingCount = 24;
            _vestingFrequency = 30;
        } else if (_vaultToInit == VaultEnumerator.AIRDROP) {
            require(airdropVaultAddress == address(0), "Already Inited");
            require(_vaultAddress != address(0), "Zero address");
            airdropVaultAddress = _vaultAddress;
            _vaultName = "Airdrop Vault";
            _vaultShare = airdropShare;
            _initialRelease = 0;
            _cliffDuration = 240;
            _vestingCount = 12;
            _vestingFrequency = 30;
        } else if (_vaultToInit == VaultEnumerator.TEAM) {
            require(teamVaultAddress == address(0), "Already Inited");
            require(_vaultAddress != address(0), "Zero address");
            teamVaultAddress = _vaultAddress;
            _vaultName = "Team Vault";
            _vaultShare = teamShare;
            _initialRelease = 0;
            _cliffDuration = 365;
            _vestingCount = 24;
            _vestingFrequency = 30;
        } else if (_vaultToInit == VaultEnumerator.EXCHANGES) {
            require(exchangesVaultAddress == address(0), "Already Inited");
            require(_vaultAddress != address(0), "Zero address");
            exchangesVaultAddress = _vaultAddress;
            _vaultName = "Exchanges Vault";
            _vaultShare = exchangesShare;
            _initialRelease = 0;
            _cliffDuration = 90;
            _vestingCount = 24;
            _vestingFrequency = 30;
        } else if (_vaultToInit == VaultEnumerator.TREASURY) {
            require(treasuryVaultAddress == address(0), "Already Inited");
            require(_vaultAddress != address(0), "Zero address");
            treasuryVaultAddress = _vaultAddress;
            _vaultName = "Treasury Vault";
            _vaultShare = treasuryShare;
            _initialRelease = 0;
            _cliffDuration = 90;
            _vestingCount = 36;
            _vestingFrequency = 30;
        } else {
            revert("Invalid vault");
        }

        soulsToken.approve(_vaultAddress, _vaultShare);
        IVault _vault = IVault(_vaultAddress);
        _vault.lockTokens(_vaultShare, _initialRelease, _cliffDuration, _vestingCount, _vestingFrequency);
        managers.addAddressToTrustedSources(_vaultAddress, _vaultName);
    }

    function _initPlayToEarnVault(uint256 _daysUntilFirstVesting) internal {
        IVault _playToEarnVault = IVault(playToEarnVaultAddress);
        soulsToken.approve(playToEarnVaultAddress, playToEarnShare);

        _playToEarnVault.lockTokens(playToEarnShare, 0, _daysUntilFirstVesting, 84, 30);
        managers.addAddressToTrustedSources(playToEarnVaultAddress, "PlayToEarn Vault");
    }

    function approveTokensToCrowdFundingContract(address _crowdFundingContractAddress) external onlyOwner {
        require(_crowdFundingContractAddress != address(0), "Zero address");
        soulsToken.approve(_crowdFundingContractAddress, type(uint256).max);
    }

	//TODO: what to do with tokens
    function withdrawLPTokens(address _to) external onlyManager {
        require(block.timestamp > liquidityTokensUnlockTime, "LP tokens are locked still");
        require(dexPairAddress != address(0), "Init Liquidity Vault first");
        require(_to != address(0), "Zero address");
        uint256 _tokenBalance = IERC20(dexPairAddress).balanceOf(address(this));
        require(_tokenBalance > 0, "Zero balance LP tokens");
        string memory _title = "Withdraw LP Tokens";
        bytes memory _valueInBytes = abi.encode(_to);
        managers.approveTopic(_title, _valueInBytes);

        if (managers.isApproved(_title, _valueInBytes)) {
            require(IERC20(dexPairAddress).transfer(_to, _tokenBalance), "Token transfer error");
            managers.deleteTopic(_title);
        }
    }

    function withdrawTokens(address _tokenAddress, address _to) external onlyManager {
        require(_tokenAddress != address(soulsToken), "Not allowed to withdraw SOULS");
        require(_tokenAddress != dexPairAddress, "Use withdrawLPTokens function to withdraw LP tokens");
        require(_to != address(0), "Zero address");
        uint256 _tokenBalance = IERC20(_tokenAddress).balanceOf(address(this));
        require(_tokenBalance > 0, "Token balance is zero");
        string memory _title = "Withdraw Tokens";
        bytes memory _valueInBytes = abi.encode(_tokenAddress, _to);
        managers.approveTopic(_title, _valueInBytes);

        if (managers.isApproved(_title, _valueInBytes)) {
            require(IERC20(dexPairAddress).transfer(_to, _tokenBalance), "Token transfer error");
            managers.deleteTopic(_title);
        }
    }


    //TODO: Below lines for test purpose and will be deleted for production.
    function addToTrustedSources(address _address, string calldata _name) external onlyOwner {
        managers.addAddressToTrustedSources(_address, _name);
    }

    bool public approveTopicTestVariable;

    function testApproveTopicFunction(address _testAddress) external onlyManager {
        string memory _title = "Test Approve Topic Function";
        bytes memory _valueInBytes = abi.encode(_testAddress);
        managers.approveTopic(_title, _valueInBytes);

        if (managers.isApproved(_title, _valueInBytes)) {
            approveTopicTestVariable = true;
            managers.deleteTopic(_title);
        }
    }

    function transferSoulsToAddress(address _receiver, uint256 _amount) external onlyOwner {
        require(soulsToken.transfer(_receiver, _amount), "Token transfer error");
    }
}
