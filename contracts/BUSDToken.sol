// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title TEST BUSD TOKEN
/// @dev To use while adding liquidity on pancakeswap for test purpose.

contract BUSDToken is ERC20 {
    constructor() ERC20("MyBUSD", "MBUSD") {
        _mint(msg.sender, 1000000000 * 10**decimals());
    }
}
