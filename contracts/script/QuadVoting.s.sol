// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

import "forge-std/Script.sol";
import "../src/QuadVoting.sol";

contract DeployQuadVoting is Script {
    function run() external {
        // Get deployer's private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);
        
        // Setup election parameters
        string memory electionName = "2024 Community Vote";
        
        string[] memory candidates = new string[](5);
        candidates[0] = "Alice Johnson";
        candidates[1] = "Bob Smith";
        candidates[2] = "Charlie Davis";
        candidates[3] = "Diana Evans";
        candidates[4] = "Ethan Brown";
        
        address overseer = vm.addr(deployerPrivateKey); // Deployer is overseer
        uint256 deadline = 10 minutes; // 10 minute voting period
        
        // Deploy contract
        QuadVoting quadVoting = new QuadVoting(
            electionName,
            candidates,
            overseer,
            deadline
        );
        
        vm.stopBroadcast();
        
        // Log deployment info
        console.log("QuadVoting deployed at:", address(quadVoting));
        console.log("Overseer:", overseer);
        console.log("Deadline:", deadline);
        console.log("Candidates:", candidates.length);
    }
}

contract SetupVoters is Script {
    function run() external {
        // Load contract address from environment or argument
        address contractAddress = vm.envAddress("CONTRACT_ADDRESS");
        uint256 overseerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        QuadVoting quadVoting = QuadVoting(contractAddress);
        
        // Prepare voter addresses
        address[] memory voters = new address[](5);
        voters[0] = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
        voters[1] = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
        voters[2] = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
        voters[3] = 0x90F79bf6EB2c4f870365E785982E1f101E93b906;
        voters[4] = 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65;
        
        vm.startBroadcast(overseerPrivateKey);
        
        // Give vote access
        quadVoting.giveVoteAccess(voters);
        
        vm.stopBroadcast();
        
        console.log("Vote access granted to", voters.length, "addresses");
    }
}

contract CastVote is Script {
    function run() external {
        address contractAddress = vm.envAddress("CONTRACT_ADDRESS");
        uint256 voterPrivateKey = vm.envUint("VOTER_PRIVATE_KEY");
        
        QuadVoting quadVoting = QuadVoting(contractAddress);
        
        // Prepare votes
        uint256[] memory votes = new uint256[](3);
        votes[0] = 50; // Alice: 50 votes
        votes[1] = 30; // Bob: 30 votes
        votes[2] = 20; // Charlie: 20 votes
        
        vm.startBroadcast(voterPrivateKey);
        
        // Cast vote
        quadVoting.vote(votes);
        
        vm.stopBroadcast();
        
        console.log("Vote cast successfully");
        console.log("Alice:", votes[0]);
        console.log("Bob:", votes[1]);
        console.log("Charlie:", votes[2]);
    }
}

contract CheckResults is Script {
    function run() external view {
        address contractAddress = vm.envAddress("CONTRACT_ADDRESS");
        QuadVoting quadVoting = QuadVoting(contractAddress);
        
        // Get election info
        console.log("=== Election Results ===");
        console.log("Name:", quadVoting.QVname());
        console.log("Status:", quadVoting.QVended() ? "Active" : "Ended");
        console.log("");
        
        uint256 candidateCount = quadVoting.candidates();
        
        for (uint256 i = 0; i < candidateCount; i++) {
            string memory name = quadVoting.candidateNames(i);
            uint256 totalVotes = quadVoting.candidateVotes(i);
            uint256 sqrtVotes = quadVoting.sqrtcandyVotes(i);
            uint256 quadVotes = quadVoting.quadcandyVotes(i);
            
            console.log("Candidate:", name);
            console.log("  Raw Votes:", totalVotes);
            console.log("  Sqrt Votes:", sqrtVotes);
            console.log("  Quad Votes:", quadVotes);
            console.log("");
        }
        
        console.log("Total Quadratic Votes:", quadVoting.quadTotal());
    }
}

// Combined deployment and setup script
contract FullDeployment is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy
        string[] memory candidates = new string[](3);
        candidates[0] = "Alice";
        candidates[1] = "Bob";
        candidates[2] = "Charlie";
        
        QuadVoting quadVoting = new QuadVoting(
            "Test Election",
            candidates,
            vm.addr(deployerPrivateKey),
            block.timestamp + 7 days
        );
        
        // Setup voters
        address[] memory voters = new address[](3);
        voters[0] = 0x1234567890123456789012345678901234567890;
        voters[1] = 0x2345678901234567890123456789012345678901;
        voters[2] = 0x3456789012345678901234567890123456789012;
        
        quadVoting.giveVoteAccess(voters);
        
        vm.stopBroadcast();
        
        console.log("Deployed and configured at:", address(quadVoting));
    }
}