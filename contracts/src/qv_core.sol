// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

/// @notice Core quadratic voting logic for a single voting session with 5 fixed options.
/// @dev State-changing functions are gated to a controller (caller) contract.
contract QuadraticVoting{
    // --------- Errors --------
    error NotOwner();
    error NotController();
    error ControllerAlreadySet();
    error ZeroAddress();
    error AmountZero();
    error NotAllowedVoter();
    error VotingNotActive();
    error VotingAlreadyActive();
    error VotingEnded();
    error InvalidEndTime();
    error InvalidOption();
    error VotesTooLarge();
    error InsufficientCredits();

    // --------- Events ---------
    event ControllerSet(address indexed controller);
    event VotersSet(address[] voters, bool allowed);
    event VotingStarted(uint64 startTime, uint64 endTime);
    event VotingEndedEvent(uint64 endTime);
    event OptionLabelsSet(bytes32[5] labels);
    event CreditsIncreased(address indexed user, uint256 amount);
    event CreditsDecreased(address indexed user, uint256 amount);
    event VoteCast(address indexed voter, uint8 indexed option, uint256 oldVotes, uint256 newVotes, uint256 oldCost, uint256 newCost);

    address public owner;
    address public controller;

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier onlyController() {
        if (msg.sender != controller) revert NotController();
        _;
    }

    uint8 public constant OPTION_COUNT = 5;

    bool public votingActive;
    uint64 public startTime;
    uint64 public endTime;

    bytes32[5] public optionLabels;

    mapping(address => bool) public allowedVoter;
    mapping(address => uint256) public credits;
    mapping(address => uint256) public spent;

    mapping(address => uint256[5]) internal _votes; 
    uint256[5] public totalVotes; 

    constructor(address _owner) {
        if (_owner == address(0)) revert ZeroAddress();
        owner = _owner;
    }

    function setController(address _controller) external onlyOwner {
        if (_controller == address(0)) revert ZeroAddress();
        if (controller != address(0)) revert ControllerAlreadySet();
        controller = _controller;
        emit ControllerSet(_controller);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        owner = newOwner;
    }

    // ------------------------------------------- Admin  pannel-------------------------
    function setOptionLabels(bytes32[5] calldata labels) external onlyController {
        optionLabels = labels;
        emit OptionLabelsSet(labels);
    }

    function setVoters(address[] calldata voters, bool allowed) external onlyController {
        for (uint256 i = 0; i < voters.length; i++) {
            address v = voters[i];
            if (v == address(0)) revert ZeroAddress();
            allowedVoter[v] = allowed;
        }
        emit VotersSet(voters, allowed);
    }

    function startVoting(uint64 _endTime) external onlyController {
        if (votingActive) revert VotingAlreadyActive();
        uint64 nowTs = uint64(block.timestamp);
        if (_endTime <= nowTs) revert InvalidEndTime();
        votingActive = true;
        startTime = nowTs;
        endTime = _endTime;
        emit VotingStarted(nowTs, _endTime);
    }

    function endVoting() external onlyController {
        if (!votingActive) revert VotingNotActive();
        votingActive = false;
        emit VotingEndedEvent(uint64(block.timestamp));
    }

    // --------- Controller-only: credit accounting ---------
    function increaseCredits(address user, uint256 amount) external onlyController {
        if (user == address(0)) revert ZeroAddress();
        if (amount == 0) revert AmountZero();
        credits[user] += amount;
        emit CreditsIncreased(user, amount);
    }

    function decreaseCredits(address user, uint256 amount) external onlyController {
        if (user == address(0)) revert ZeroAddress();
        if (amount == 0) revert AmountZero();
        uint256 bal = credits[user];
        if (bal < amount) revert InsufficientCredits();
        credits[user] = bal - amount;
        emit CreditsDecreased(user, amount);
    }



    // ---------------------------------------- Voting ---------------------------

    function castVote(address voter, uint8 option, uint256 newVotes) external onlyController {
        if (voter == address(0)) revert ZeroAddress();
        if (!allowedVoter[voter]) revert NotAllowedVoter();
        if (option >= OPTION_COUNT) revert InvalidOption();

        if (!votingActive) revert VotingNotActive();
        if (block.timestamp > endTime) revert VotingEnded();

        uint256 oldVotes = _votes[voter][option];
        uint256 oldCost = oldVotes * oldVotes;
        uint256 newCost = newVotes * newVotes;

        if (newCost >= oldCost) {
            uint256 delta = newCost - oldCost;
            if (credits[voter] < delta) revert InsufficientCredits();
            credits[voter] -= delta;
            spent[voter] += delta;
        } else {
            uint256 refund = oldCost - newCost;
            credits[voter] += refund;
            spent[voter] -= refund;
        }

        if (newVotes >= oldVotes) totalVotes[option] += (newVotes - oldVotes);
        else totalVotes[option] -= (oldVotes - newVotes);

        _votes[voter][option] = newVotes;
        emit VoteCast(voter, option, oldVotes, newVotes, oldCost, newCost);
    }

    function votesOf(address voter) external view returns (uint256[5] memory) {
        return _votes[voter];
    }

    function results() external view returns (uint256[5] memory totals, bytes32[5] memory labels) {
        return (totalVotes, optionLabels);
    }

}
