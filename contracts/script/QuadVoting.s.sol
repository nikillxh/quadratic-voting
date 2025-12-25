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
        // Define Anvil private keys for voters
        uint256[] memory voterPrivateKeys = new uint256[](5);

        // Hardcoded Anvil private keys
        uint256;
        voterPrivateKeys[0] = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        voterPrivateKeys[1] = 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d;
        voterPrivateKeys[2] = 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a;
        voterPrivateKeys[3] = 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6;
        voterPrivateKeys[4] = 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a;


        // Hardcoded deployed contract address
        address contractAddress = vm.envAddress("CONTRACT_ADDRESS");
        QuadVoting quadVoting = QuadVoting(contractAddress);

        // Select voter (change index to simulate different voters)
        for (uint256 i = 0; i < 5; i++) {
            castVoteAsVoter(quadVoting, voterPrivateKeys[i]);
        }
    }

    function castVoteAsVoter(QuadVoting quadVoting, uint256 voterPrivateKey) internal {
        address voter = vm.addr(voterPrivateKey);
        
        // Define votes for candidates
        uint256[] memory votes = new uint256[](5);

        // Votes (must match candidate count)
        uint256;
        votes[0] = 23;
        votes[1] = 31;
        votes[2] = 43;
        votes[3] = 3;
        votes[4] = 0;

        vm.startBroadcast(voterPrivateKey);

        quadVoting.vote(votes);

        vm.stopBroadcast();

        console.log("Vote cast successfully");
        console.log("Voter:", voter);
        for (uint256 i = 0; i < votes.length; i++) {
            console2.log("Vote", i, votes[i]);
        }
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