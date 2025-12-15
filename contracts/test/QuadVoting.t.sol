// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

import "forge-std/Test.sol";
import "../src/QuadVoting.sol";

contract QuadVotingTest is Test {
    QuadVoting public quadVoting;
    
    address public overseer = address(1);
    address public voter1 = address(2);
    address public voter2 = address(3);
    address public voter3 = address(4);
    
    string[] public candidates;
    uint256 public deadline;
    
    function setUp() public {
        // Setup candidates
        candidates.push("Alice");
        candidates.push("Bob");
        candidates.push("Charlie");
        
        // Set deadline to 1 day from now
        deadline = block.timestamp + 1 days;
        
        // Deploy contract
        vm.prank(overseer);
        quadVoting = new QuadVoting("Test Election", candidates, overseer, deadline);
    }
    
    function testInitialState() public {
        assertEq(quadVoting.overseer(), overseer);
        assertEq(quadVoting.QVname(), "Test Election");
        assertEq(quadVoting.candidates(), 3);
        assertEq(quadVoting.deadline(), deadline);
        assertEq(quadVoting.candidateNames(0), "Alice");
        assertEq(quadVoting.candidateNames(1), "Bob");
        assertEq(quadVoting.candidateNames(2), "Charlie");
    }
    
    function testGiveVoteAccess() public {
        address[] memory voters = new address[](2);
        voters[0] = voter1;
        voters[1] = voter2;
        
        vm.prank(overseer);
        bool success = quadVoting.giveVoteAccess(voters);
        
        assertTrue(success);
        assertTrue(quadVoting.voteStatus(voter1));
        assertTrue(quadVoting.voteStatus(voter2));
        assertFalse(quadVoting.voteStatus(voter3));
    }
    
    function testGiveVoteAccessOnlyOverseer() public {
        address[] memory voters = new address[](1);
        voters[0] = voter1;
        
        vm.prank(voter1);
        vm.expectRevert("Only overseer!");
        quadVoting.giveVoteAccess(voters);
    }
    
    function testVoteSuccess() public {
        // Give vote access
        address[] memory voters = new address[](1);
        voters[0] = voter1;
        
        vm.prank(overseer);
        quadVoting.giveVoteAccess(voters);
        
        // Create votes array
        uint256[] memory votes = new uint256[](3);
        votes[0] = 50; // Alice
        votes[1] = 30; // Bob
        votes[2] = 20; // Charlie
        
        // Cast vote
        vm.prank(voter1);
        bool success = quadVoting.vote(votes);
        
        assertTrue(success);
        assertFalse(quadVoting.voteStatus(voter1)); // Should be false after voting
        assertEq(quadVoting.candidateVotes(0), 50);
        assertEq(quadVoting.candidateVotes(1), 30);
        assertEq(quadVoting.candidateVotes(2), 20);
    }
    
    function testVoteWithoutAccess() public {
        uint256[] memory votes = new uint256[](3);
        votes[0] = 50;
        votes[1] = 30;
        votes[2] = 20;
        
        vm.prank(voter1);
        vm.expectRevert("Already voted or Ineligible!");
        quadVoting.vote(votes);
    }
    
    function testVoteExceedsLimit() public {
        // Give vote access
        address[] memory voters = new address[](1);
        voters[0] = voter1;
        
        vm.prank(overseer);
        quadVoting.giveVoteAccess(voters);
        
        // Create votes array exceeding 100
        uint256[] memory votes = new uint256[](3);
        votes[0] = 60;
        votes[1] = 30;
        votes[2] = 20; // Total = 110
        
        vm.prank(voter1);
        vm.expectRevert("Exceeds 100 votes!");
        quadVoting.vote(votes);
    }
    
    function testCannotVoteTwice() public {
        // Give vote access
        address[] memory voters = new address[](1);
        voters[0] = voter1;
        
        vm.prank(overseer);
        quadVoting.giveVoteAccess(voters);
        
        // First vote
        uint256[] memory votes = new uint256[](3);
        votes[0] = 50;
        votes[1] = 30;
        votes[2] = 20;
        
        vm.prank(voter1);
        quadVoting.vote(votes);
        
        // Try to vote again
        vm.prank(voter1);
        vm.expectRevert("Already voted or Ineligible!");
        quadVoting.vote(votes);
    }
    
    function testVoteAfterDeadline() public {
        // Give vote access
        address[] memory voters = new address[](1);
        voters[0] = voter1;
        
        vm.prank(overseer);
        quadVoting.giveVoteAccess(voters);
        
        // Warp time past deadline
        vm.warp(deadline + 1);
        
        uint256[] memory votes = new uint256[](3);
        votes[0] = 50;
        votes[1] = 30;
        votes[2] = 20;
        
        vm.prank(voter1);
        vm.expectRevert("QV Ended!");
        quadVoting.vote(votes);
    }
    
    function testGiveVoteAccessAfterDeadline() public {
        vm.warp(deadline + 1);
        
        address[] memory voters = new address[](1);
        voters[0] = voter1;
        
        vm.prank(overseer);
        vm.expectRevert("QV Ended!");
        quadVoting.giveVoteAccess(voters);
    }
    
    function testQVStatus() public {
        // Before deadline
        assertFalse(quadVoting.QVstatus());
        
        // After deadline
        vm.warp(deadline + 1);
        assertTrue(quadVoting.QVstatus());
    }
    
    function testMultipleVoters() public {
        // Give vote access to multiple voters
        address[] memory voters = new address[](3);
        voters[0] = voter1;
        voters[1] = voter2;
        voters[2] = voter3;
        
        vm.prank(overseer);
        quadVoting.giveVoteAccess(voters);
        
        // Voter 1 votes
        uint256[] memory votes1 = new uint256[](3);
        votes1[0] = 40;
        votes1[1] = 30;
        votes1[2] = 30;
        
        vm.prank(voter1);
        quadVoting.vote(votes1);
        
        // Voter 2 votes
        uint256[] memory votes2 = new uint256[](3);
        votes2[0] = 50;
        votes2[1] = 25;
        votes2[2] = 25;
        
        vm.prank(voter2);
        quadVoting.vote(votes2);
        
        // Check totals
        assertEq(quadVoting.candidateVotes(0), 90);
        assertEq(quadVoting.candidateVotes(1), 55);
        assertEq(quadVoting.candidateVotes(2), 55);
    }
    
    function testSqrtCalculation() public {
        // Give vote access
        address[] memory voters = new address[](1);
        voters[0] = voter1;
        
        vm.prank(overseer);
        quadVoting.giveVoteAccess(voters);
        
        // Vote with specific numbers to test sqrt
        uint256[] memory votes = new uint256[](3);
        votes[0] = 25; // sqrt should be ~5000 (scaled)
        votes[1] = 36; // sqrt should be 6000 (scaled)
        votes[2] = 49; // sqrt should be 7000 (scaled)
        
        vm.prank(voter1);
        quadVoting.vote(votes);
        
        // Check sqrt values (approximately)
        uint256 sqrt0 = quadVoting.sqrtcandyVotes(0);
        uint256 sqrt1 = quadVoting.sqrtcandyVotes(1);
        uint256 sqrt2 = quadVoting.sqrtcandyVotes(2);
        
        // Allow some margin for rounding
        assertApproxEqAbs(sqrt0, 5000, 10);
        assertApproxEqAbs(sqrt1, 6000, 10);
        assertApproxEqAbs(sqrt2, 7000, 10);
    }
    
    function testFuzzVote(uint8 v1, uint8 v2, uint8 v3) public {
        vm.assume(uint256(v1) + uint256(v2) + uint256(v3) <= 100);
        
        // Give vote access
        address[] memory voters = new address[](1);
        voters[0] = voter1;
        
        vm.prank(overseer);
        quadVoting.giveVoteAccess(voters);
        
        uint256[] memory votes = new uint256[](3);
        votes[0] = uint256(v1);
        votes[1] = uint256(v2);
        votes[2] = uint256(v3);
        
        vm.prank(voter1);
        bool success = quadVoting.vote(votes);
        
        assertTrue(success);
        assertEq(quadVoting.candidateVotes(0), v1);
        assertEq(quadVoting.candidateVotes(1), v2);
        assertEq(quadVoting.candidateVotes(2), v3);
    }
}