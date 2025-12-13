// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";

import {QuadraticVoting} from "../src/qv_core.sol";
import {qv_caller} from "../src/qv_caller.sol";

contract QuadraticVotingTest is Test {
    QuadraticVoting core;
    qv_caller caller;

    address owner = address(0xA);
    address bob = address(0xB);
    address carol = address(0xC);

    function setUp() public {
        // Core owner is this test contract to simplify wiring.
        core = new QuadraticVoting(address(this));
        vm.prank(owner);
        caller = new qv_caller(address(core));
        core.setController(address(caller));
    }

    // ---------- Wiring / access control ----------

    function test_SetController_OnlyOnce() public {
        QuadraticVoting c = new QuadraticVoting(address(this));
        c.setController(address(0x1234));
        vm.expectRevert(QuadraticVoting.ControllerAlreadySet.selector);
        c.setController(address(0x5678));
    }

    function test_SetController_OnlyOwner() public {
        QuadraticVoting c = new QuadraticVoting(address(this));
        vm.prank(bob);
        vm.expectRevert(QuadraticVoting.NotOwner.selector);
        c.setController(address(0x1234));
    }

    function test_CoreMutations_RequireController() public {
        vm.expectRevert(QuadraticVoting.NotController.selector);
        core.startVoting(uint64(block.timestamp + 10));

        vm.expectRevert(QuadraticVoting.NotController.selector);
        core.setVoters(_arr1(bob), true);

        vm.expectRevert(QuadraticVoting.NotController.selector);
        core.increaseCredits(bob, 1);

        vm.expectRevert(QuadraticVoting.NotController.selector);
        core.castVote(bob, 0, 1);
    }

    function test_CallerAdmin_OnlyOwner() public {
        vm.prank(bob);
        vm.expectRevert(qv_caller.NotOwner.selector);
        caller.setVoters(_arr1(bob), true);

        vm.prank(bob);
        vm.expectRevert(qv_caller.NotOwner.selector);
        caller.startVoting(uint64(block.timestamp + 100));

        vm.prank(bob);
        vm.expectRevert(qv_caller.NotOwner.selector);
        caller.grantCredits(bob, 1);
    }

    function test_StartVoting_SetsTimes_AndGuards() public {
        vm.prank(owner);
        caller.startVoting(uint64(block.timestamp + 100));

        assertTrue(core.votingActive());
        assertEq(core.startTime(), uint64(block.timestamp));
        assertEq(core.endTime(), uint64(block.timestamp + 100));

        vm.prank(owner);
        vm.expectRevert(QuadraticVoting.VotingAlreadyActive.selector);
        caller.startVoting(uint64(block.timestamp + 200));

        vm.prank(owner);
        caller.endVoting();
        assertFalse(core.votingActive());

        vm.prank(owner);
        vm.expectRevert(QuadraticVoting.VotingNotActive.selector);
        caller.endVoting();
    }

    function test_StartVoting_RevertsInvalidEndTime() public {
        vm.prank(owner);
        vm.expectRevert(QuadraticVoting.InvalidEndTime.selector);
        caller.startVoting(uint64(block.timestamp));
    }

    function test_SetVoters_AllowlistGatesVoting() public {
        vm.prank(owner);
        caller.setVoters(_arr1(bob), true);

        vm.prank(owner);
        caller.startVoting(uint64(block.timestamp + 100));

        vm.prank(owner);
        caller.grantCredits(bob, 100);

        vm.prank(bob);
        caller.castVote(0, 3);

        vm.prank(carol);
        vm.expectRevert(QuadraticVoting.NotAllowedVoter.selector);
        caller.castVote(0, 1);
    }

    function test_GrantCredits_AndRevokeCredits() public {
        vm.prank(owner);
        caller.grantCredits(bob, 50);
        assertEq(core.credits(bob), 50);

        vm.prank(owner);
        caller.revokeCredits(bob, 20);
        assertEq(core.credits(bob), 30);
    }

    function test_QuadraticCost_DeductsDelta_RefundsOnDecrease() public {
        vm.prank(owner);
        caller.setVoters(_arr1(bob), true);
        vm.prank(owner);
        caller.startVoting(uint64(block.timestamp + 100));
        vm.prank(owner);
        caller.grantCredits(bob, 1_000);

        // option0: 0 -> 5, cost 25
        vm.prank(bob);
        caller.castVote(0, 5);
        assertEq(core.spent(bob), 25);
        assertEq(core.credits(bob), 975);
        assertEq(core.totalVotes(0), 5);

        // option0: 5 -> 7, delta 49-25 = 24
        vm.prank(bob);
        caller.castVote(0, 7);
        assertEq(core.spent(bob), 49);
        assertEq(core.credits(bob), 951);
        assertEq(core.totalVotes(0), 7);

        // option0: 7 -> 2, refund 49-4 = 45
        vm.prank(bob);
        caller.castVote(0, 2);
        assertEq(core.spent(bob), 4);
        assertEq(core.credits(bob), 996);
        assertEq(core.totalVotes(0), 2);
    }

    function test_SumSquaresAcrossOptions() public {
        vm.prank(owner);
        caller.setVoters(_arr1(bob), true);
        vm.prank(owner);
        caller.startVoting(uint64(block.timestamp + 100));
        vm.prank(owner);
        caller.grantCredits(bob, 1_000);

        // option0=3 => 9
        vm.prank(bob);
        caller.castVote(0, 3);
        // option1=4 => +16
        vm.prank(bob);
        caller.castVote(1, 4);

        assertEq(core.spent(bob), 25);
        assertEq(core.totalVotes(0), 3);
        assertEq(core.totalVotes(1), 4);

        // update option0: 3->5 delta +16 => spent 41
        vm.prank(bob);
        caller.castVote(0, 5);
        assertEq(core.spent(bob), 41);

        // update option1: 4->1 refund 15 => spent 26
        vm.prank(bob);
        caller.castVote(1, 1);
        assertEq(core.spent(bob), 26);
    }

    function test_InvalidOption_Reverts() public {
        vm.prank(owner);
        caller.setVoters(_arr1(bob), true);
        vm.prank(owner);
        caller.startVoting(uint64(block.timestamp + 100));
        vm.prank(owner);
        caller.grantCredits(bob, 100);

        vm.prank(bob);
        vm.expectRevert(QuadraticVoting.InvalidOption.selector);
        caller.castVote(5, 1);
    }

    function test_VotingNotActive_RevertsCast() public {
        vm.prank(owner);
        caller.setVoters(_arr1(bob), true);
        vm.prank(owner);
        caller.grantCredits(bob, 100);

        vm.prank(bob);
        vm.expectRevert(QuadraticVoting.VotingNotActive.selector);
        caller.castVote(0, 1);
    }

    function test_VotingEndedByTime_RevertsCast() public {
        vm.prank(owner);
        caller.setVoters(_arr1(bob), true);
        vm.prank(owner);
        caller.startVoting(uint64(block.timestamp + 1));
        vm.prank(owner);
        caller.grantCredits(bob, 100);

        vm.warp(block.timestamp + 2);

        vm.prank(bob);
        vm.expectRevert(QuadraticVoting.VotingEnded.selector);
        caller.castVote(0, 1);
    }


    function test_Results_View() public {
        bytes32[5] memory labels = [bytes32("A"), bytes32("B"), bytes32("C"), bytes32("D"), bytes32("E")];
        vm.prank(owner);
        caller.setOptionLabels(labels);

        vm.prank(owner);
        caller.setVoters(_arr2(bob, carol), true);
        vm.prank(owner);
        caller.startVoting(uint64(block.timestamp + 100));
        vm.prank(owner);
        caller.grantCredits(bob, 1_000);
        vm.prank(owner);
        caller.grantCredits(carol, 1_000);

        vm.prank(bob);
        caller.castVote(2, 4);
        vm.prank(carol);
        caller.castVote(2, 1);

        (uint256[5] memory totals, bytes32[5] memory outLabels) = core.results();
        assertEq(outLabels[0], labels[0]);
        assertEq(outLabels[4], labels[4]);
        assertEq(totals[2], 5);
    }

    function testFuzz_CostEqualsSquare(uint64 votes_) public {
        vm.prank(owner);
        caller.setVoters(_arr1(bob), true);
        vm.prank(owner);
        caller.startVoting(uint64(block.timestamp + 100));

        uint256 v = uint256(votes_ % 1_000_000);
        uint256 cost = v * v;

        vm.prank(owner);
        caller.grantCredits(bob, cost + 7);

        vm.prank(bob);
        caller.castVote(4, v);

        assertEq(core.spent(bob), cost);
        assertEq(core.credits(bob), 7);
    }

    function _arr1(address a) internal pure returns (address[] memory r) {
        r = new address[](1);
        r[0] = a;
    }

    function _arr2(address a, address b) internal pure returns (address[] memory r) {
        r = new address[](2);
        r[0] = a;
        r[1] = b;
    }
}
