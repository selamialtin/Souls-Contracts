// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

struct TokenReward {
    uint256 amount;
    uint256 releaseDate;
    bool isClaimed;
    bool isActive;
}

interface ICrowdFunding {
    function addRewards(
        address[] memory _rewardOwners,
        uint256[] memory _advancePayments,
        uint256[] memory _amountsPerVesting,
        uint8[] memory _numberOfVestings,
        uint256 _releaseDate,
        address _tokenHolder
    ) external;

    function claimTokens(uint8 _vestingIndex) external;

    function deactivateInvestorVesting(
        address _rewardOwner,
        uint8 _vestingIndex,
        address _tokenReceiver
    ) external;

    function activateInvestorVesting(
        address _rewardOwner,
        uint8 _vestingIndex,
        address _tokenSource
    ) external;

    function addToBlacklist(address _rewardOwner, address _tokenReceiver) external;

    function removeFromBlacklist(address _rewardOwner, address _tokenSource) external;

    function fetchRewardsInfo(uint8 _vestingIndex) external view returns (TokenReward memory);

    function fetchRewardsInfoForAccount(address _rewardOwner, uint8 _vestingIndex)
        external
        view
        returns (TokenReward memory);

    function isInBlacklist(address _address, uint256 _time) external view returns (bool);

    function getTotalBalance() external view returns (uint256);
}
