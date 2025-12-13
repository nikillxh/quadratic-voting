// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {QuadraticVoting} from "./qv_core.sol";

/// @notice Thin facade that calls into `QuadraticVoting`.
/// @dev Users interact with this contract; it is configured as the core's `controller`.
contract qv_caller {
    // --------- Errors ---------
    error NotOwner();

    QuadraticVoting public immutable core;
    address public owner;

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(address coreAddress) {
        core = QuadraticVoting(coreAddress);
        owner = msg.sender;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    // --------- Admin: setup + lifecycle ---------
    function setVoters(address[] calldata voters, bool allowed) external onlyOwner {
        core.setVoters(voters, allowed);
    }

    function setOptionLabels(bytes32[5] calldata labels) external onlyOwner {
        core.setOptionLabels(labels);
    }

    function startVoting(uint64 endTime) external onlyOwner {
        core.startVoting(endTime);
    }

    function endVoting() external onlyOwner {
        core.endVoting();
    }

    // --------- Admin: credits (no deposits/withdraws) ---------
    function grantCredits(address voter, uint256 amount) external onlyOwner {
        core.increaseCredits(voter, amount);
    }

    function revokeCredits(address voter, uint256 amount) external onlyOwner {
        core.decreaseCredits(voter, amount);
    }

    // --------- User: voting ---------
    function castVote(uint8 option, uint256 votes) external {
        core.castVote(msg.sender, option, votes);
    }
}
