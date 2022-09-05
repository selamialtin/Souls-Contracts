// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IVault.sol";

interface ILiquidityVault is IVault {
    function getDEXPairAddress() external view returns (address);

    function lockTokens(uint256 _totalAmount) external;

    function BUSDAmountForInitialLiquidity() external returns (uint256);

    function withdrawMarketMakerShare(address _receiver, uint256 _amount) external;
}
