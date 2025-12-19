// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract QuadVoting {
    // Overseer name
    address public overseer; 

    // Quadratic Voting name
    string public QVname; 

    // Vote status of voters
    mapping (address => uint8) public voteStatus;

    ///////////////////////////////
    // Vote Status               //
    ///////////////////////////////
    // 0 = Not a voter           //
    // 1 = Voter & not yet voted //
    // 2 = Voter & voted         //
    ///////////////////////////////

    // Votes of candidates, Sqrt Sum Votes, Quadratic Votes
    // Candidate options, Total QuadVotes, Total candidates
    uint256[] public candidateVotes;
    uint256[] public sqrtcandyVotes;
    uint256[] public quadcandyVotes;
    string[] public candidateNames;
    uint256 public quadTotal;
    uint256 public candidates;

    // Quadratic Voting Deadline
    uint256 public deadline;

    // Modifier for Online QV status
    modifier voteOnline() {
        require(block.timestamp < deadline, "QV Ended!");
        _;
    }

    // Modifier for Overseer access
    modifier ownerControl() {
        require(msg.sender == overseer, "Only overseer!"); 
        _;
    }

    // Constructor
    constructor(string memory _QVname, string[] memory _candidates, address _overseer, uint256 _deadline) {
        overseer = _overseer;
        QVname = _QVname;
        candidates = _candidates.length;
        candidateNames = _candidates;
        candidateVotes = new uint256[](candidates);
        sqrtcandyVotes = new uint256[](candidates);
        quadcandyVotes = new uint256[](candidates);
        deadline = block.timestamp + _deadline;
    }

    // Vote Function
    function vote(uint256[] calldata _votes) public
    voteOnline returns (bool) {
        require(voteStatus[msg.sender] == 1, "Already voted or Ineligible!");
        checkVotes(_votes);
        voteStatus[msg.sender] = 2;
        uint256 quadSum = 0;
        for (uint256 i = 0; i < _votes.length; i++) {
            candidateVotes[i] += _votes[i];

            uint256 num = sqrt3(_votes[i]);
            sqrtcandyVotes[i] += num;

            quadcandyVotes[i] = sqrtcandyVotes[i]**2;
            quadSum += quadcandyVotes[i];
        }
        quadTotal = quadSum;

        return true;
    }

    // Square Root
    function sqrt3(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;

        // Scaling input by 1000² = 1e6
        uint256 scaled = x * 1e6;

        uint256 z = (scaled + 1) / 2;
        uint256 y = scaled;

        while (z < y) {
            y = z;
            z = (scaled / z + z) / 2;
        }

        return y; // Format √x * 1000
    }

    // 100 Votes check
    function checkVotes(uint256[] calldata _votes) internal view returns (bool) {
        require(_votes.length == candidates, "Candidate count mismatch!");
        uint256 totalVotes = 0;
        for (uint256 i = 0; i < _votes.length; i++) {
            totalVotes += _votes[i];
        }
        require(totalVotes <= 100, "Exceeds 100 votes!");
        return true;
    }


    // Overseer gives vote access
    function giveVoteAccess(address[] calldata addresses) public 
    voteOnline ownerControl returns (bool) {
        for (uint256 i = 0; i < addresses.length; i++) {
            // Can't vote if already voted
            if (voteStatus[addresses[i]] == 2) {continue;}
            voteStatus[addresses[i]] = 1;
        }
        return true;
    }

    // QV Ended?
    function QVended() public view returns (bool) {
        if (block.timestamp >= deadline) return true;
        return false;
    }

    // Leading Candidate
    function leadingCandidate() public view returns (uint256) {
        uint256 maxValue = candidateVotes[0];
        uint256 index = 0;

        for (uint256 i = 1; i < candidateVotes.length; i++) {
            if (candidateVotes[i] > maxValue) {
                maxValue = candidateVotes[i];
                index = i;
            }
        }

        return index;
    }
}