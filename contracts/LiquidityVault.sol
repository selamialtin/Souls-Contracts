// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Vault.sol";
import "./interfaces/IManagers.sol";
import "./interfaces/IPancakeFactory.sol";
import "./interfaces/IPancakeRouter02.sol";
import "./interfaces/IPancakePair.sol";
import "hardhat/console.sol";

contract LiquidityVault is Vault {
    uint256 public tokenAmountForLiquidity = 60_000_000 ether; //Includes CEX and DEX
    uint256 public totalDEXShare = 27_000_000 ether;
    uint256 public tokenAmountForInitialLiquidityOnDEX = 3_000_000 ether; //Just for setting price, will be added more later manually
    uint256 public amountUsedForLiquidityOnDEX;
    uint256 public CEXShare = 33_000_000 ether;

    uint256 public marketMakerShare = 9_375_000 ether;
    uint256 public initialPriceForDex = 0.009 ether;
    uint256 public balanceAddedLiquidityOnDex;
    uint256 public remainingTokensUnlockTime;

    uint256 public marketMakerShareWithdrawDeadline;
    uint256 public marketMakerShareWithdrawnAmount;
    address public DEXPairAddress;
    address BUSDTokenAddress;
    address factoryAddress;
    address routerAddress;

    constructor(
        string memory _vaultName,
        address _proxyAddress,
        address _soulsTokenAddress,
        address _managersAddress,
        address _dexRouterAddress,
        address _dexFactoryAddress,
        address _BUSDTokenAddress
    ) Vault(_vaultName, _proxyAddress, _soulsTokenAddress, _managersAddress) {
        routerAddress = _dexRouterAddress;
        factoryAddress = _dexFactoryAddress;
        BUSDTokenAddress = _BUSDTokenAddress;
        marketMakerShareWithdrawDeadline = block.timestamp + 1 days;
    }

	//TODO: remove parameter
    function lockTokens(uint256 _totalAmount) public {
        require(_totalAmount == tokenAmountForLiquidity, "Invalid amount");
        super.lockTokens(_totalAmount, 0, 0, 1, 0);
        _createLiquidityOnDex();
        remainingTokensUnlockTime = block.timestamp + 365 days;
    }

    function lockTokens(
        uint256,
        uint256,
        uint256,
        uint256,
        uint256
    ) public view override onlyOnce onlyProxy {
        revert("Vault contract must use 'lockTokens(uint256 _totalAmount)' version of this function");
    }

    function BUSDAmountForInitialLiquidity() public view returns (uint256 _busdAmount) {
        _busdAmount = (tokenAmountForInitialLiquidityOnDEX * initialPriceForDex) / 1 ether;
    }

    function withdrawTokens(address[] calldata, uint256[] calldata) external pure override {
        revert("Use withdrawRemainingTokens function for Liquidity Vault");
    }

    function withdrawRemainingTokens(address[] calldata _receivers, uint256[] calldata _amounts) external {
        require(block.timestamp > remainingTokensUnlockTime, "Remaining tokens are still locked");
        uint256 _totalAmount;
        require(_receivers.length == _amounts.length, "Receivers and Amounts must be in same size");
        for (uint256 i = 0; i < _amounts.length; i++) {
            _totalAmount += _amounts[i];
        }
        _withdrawTokens(_receivers, _amounts, _totalAmount);
    }

    function _createLiquidityOnDex() internal {
        console.log("_createLiquidityOnDex");

        uint256 _BUSDAmountForLiquidty = BUSDAmountForInitialLiquidity();
        balanceAddedLiquidityOnDex += tokenAmountForInitialLiquidityOnDEX;
        tokenVestings[0].amount -= tokenAmountForInitialLiquidityOnDEX;

        IERC20(soulsTokenAddress).approve(address(routerAddress), type(uint256).max);
        IERC20(BUSDTokenAddress).approve(address(routerAddress), type(uint256).max);
        // console.log("souls balance: %s", IERC20(soulsTokenAddress).balanceOf(address(this)));
        // console.log("busd balance: %s", IERC20(BUSDTokenAddress).balanceOf(address(this)));
        // console.log("factory:  %s", address(factory));
        // console.log(soulsTokenAddress, BUSDTokenAddress, tokenAmountForInitialLiquidityOnDEX);
        // console.log(_BUSDAmountForLiquidty, tokenAmountForInitialLiquidityOnDEX, _BUSDAmountForLiquidty, proxyAddress);
        IPancakeRouter02 _router = IPancakeRouter02(routerAddress);
        _router.addLiquidity(
            soulsTokenAddress,
            BUSDTokenAddress,
            tokenAmountForInitialLiquidityOnDEX,
            _BUSDAmountForLiquidty,
            tokenAmountForInitialLiquidityOnDEX,
            _BUSDAmountForLiquidty,
            proxyAddress,
            block.timestamp + 24 hours
        );
        console.log("liquidity added");
        IPancakeFactory _factory = IPancakeFactory(factoryAddress);
        DEXPairAddress = _factory.getPair(soulsTokenAddress, BUSDTokenAddress);
        amountUsedForLiquidityOnDEX += tokenAmountForInitialLiquidityOnDEX;
    }

    function getDEXPairAddress() public view returns (address) {
        return DEXPairAddress;
    }

    // returns sorted token addresses, used to handle return values from pairs sorted in this order
    function _sortTokens(address tokenA, address tokenB) internal pure returns (address token0, address token1) {
        require(tokenA != tokenB, "IDENTICAL_ADDRESSES");
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), "ZERO_ADDRESS");
    }

    function _getReserves(address tokenA, address tokenB) internal view returns (uint256 reserveA, uint256 reserveB) {
        (address token0, ) = _sortTokens(tokenA, tokenB);
        IPancakeFactory _factory = IPancakeFactory(factoryAddress);
        address _pairAddress = _factory.getPair(BUSDTokenAddress, soulsTokenAddress);
        IPancakePair pair = IPancakePair(_pairAddress);

        (uint256 reserve0, uint256 reserve1, ) = pair.getReserves();
        (reserveA, reserveB) = tokenA == token0 ? (reserve0, reserve1) : (reserve1, reserve0);
    }

    function getSoulsBalance() public view returns (uint256 _soulsBalance) {
        _soulsBalance = IERC20(soulsTokenAddress).balanceOf(address(this));
    }

    function getRequiredBUSDAmountForLiquidity(uint256 _tokenAmountToAdd)
        public
        view
        returns (uint256 _BUSDAmountForLiquidty)
    {
        (uint256 BUSDReserve, uint256 soulsReserve) = _getReserves(BUSDTokenAddress, soulsTokenAddress);
        IPancakeRouter02 _router = IPancakeRouter02(routerAddress);
        _BUSDAmountForLiquidty = _router.quote(_tokenAmountToAdd, soulsReserve, BUSDReserve);
    }

    //Managers Function
    function addLiquidityOnDEX(uint256 _tokenAmountToAdd) external onlyManager {
        require(_tokenAmountToAdd > 0, "Zero amount");
        uint256 _availableAmount = totalDEXShare - amountUsedForLiquidityOnDEX;
        console.log("available amount: %s", _availableAmount);
        if (block.timestamp > marketMakerShareWithdrawDeadline) {
            _availableAmount += (marketMakerShare - marketMakerShareWithdrawnAmount);
        }
        require(_availableAmount >= _tokenAmountToAdd, "Amount exeeds DEX Liquidity share");
        require(IERC20(soulsTokenAddress).balanceOf(address(this)) >= _tokenAmountToAdd, "Not enough SOULS token");

        string memory _title = "Add Liquidity On DEX";
        bytes memory _valueInBytes = abi.encode(_tokenAmountToAdd);
        managers.approveTopic(_title, _valueInBytes);
        if (managers.isApproved(_title, _valueInBytes)) {
            (uint256 BUSDReserve, uint256 soulsReserve) = _getReserves(BUSDTokenAddress, soulsTokenAddress);
            IPancakeRouter02 _router = IPancakeRouter02(routerAddress);
            uint256 _BUSDAmountToAdd = _router.quote(_tokenAmountToAdd, soulsReserve, BUSDReserve);
            IERC20 BUSDToken = IERC20(BUSDTokenAddress);
            require(BUSDToken.balanceOf(proxyAddress) >= _BUSDAmountToAdd, "BUSD balance is not enough on proxy");

            balanceAddedLiquidityOnDex += _tokenAmountToAdd;
            tokenVestings[0].amount -= _tokenAmountToAdd;

            require(BUSDToken.transferFrom(proxyAddress, address(this), _BUSDAmountToAdd), "Token transfer error");

            _router.addLiquidity(
                soulsTokenAddress,
                BUSDTokenAddress,
                _tokenAmountToAdd,
                _BUSDAmountToAdd,
                0,
                0,
                proxyAddress,
                block.timestamp + 1 hours
            );

            managers.deleteTopic(_title);
        }
    }

    //Managers Function
    function withdrawMarketMakerShare(address _receiver, uint256 _amount) external onlyManager {
        require(block.timestamp < marketMakerShareWithdrawDeadline, "Late request");
        require(marketMakerShareWithdrawnAmount + _amount <= marketMakerShare, "Amount exeeds the limits");

        string memory _title = "Withdraw Market Maker Share";
        bytes memory _valueInBytes = abi.encode(_receiver, _amount);
        managers.approveTopic(_title, _valueInBytes);
        tokenVestings[0].amount -= _amount;

        if (managers.isApproved(_title, _valueInBytes)) {
            marketMakerShareWithdrawnAmount += _amount;
            IERC20 soulsToken = IERC20(soulsTokenAddress);
            require(soulsToken.transfer(_receiver, _amount), "Token transfer error");
            managers.deleteTopic(_title);
        }
    }
}
