// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IVault {
    function lockTokens(
        uint256 _totalAmount,
        uint256 _initialRelease,
        uint256 _lockDurationInDays,
        uint256 _countOfVesting,
        uint256 _releaseFrequencyInDays
    ) external;

    function withdrawTokens(address[] memory _receivers, uint256[] memory _amounts) external;
}
