import { QVcontractAddress, useQVEnded, voteABI } from "../app/calls";
import { useEffect } from "react";
import { useWriteContract } from "wagmi";

export default function VoteButton(voteProps: { canSubmit: boolean, voteDist: bigint[], qvEnded?: boolean }) {
  const qvEnded = useQVEnded();
  const { writeContract, isPending, isSuccess, error } = useWriteContract();
  
  useEffect(() => {
    if (isSuccess) {
      window.location.reload();
    }
  }, [isSuccess]);

  function submitVote(votes: bigint[]) {
    writeContract({
      address: QVcontractAddress,
      abi: voteABI,
      functionName: "vote",
      args: [votes],
    });
  }
  
  function handleText() {
    if (qvEnded) {
        return "Voting Ended";
    } else if (isPending) {
        return "Submitting...";
    } else if (error) {
        return "Error! Try Again";
    } else {
        return "Submit Vote";
    }
  }

  function useHandleDisabled() {
    const qvEnded = useQVEnded();
    return !voteProps.canSubmit || qvEnded || isPending;
  }
  

  return (
    <div className="flex-1 justify-between px-4">
      <button className="mx-auto lg:w-100 sm:w-87 w-64 bg-blue-700 text-base md:text-xl font-semibold p-4 rounded-2xl
        disabled:bg-blue-300/30 disabled:cursor-default disabled:text-gray-400
        hover:bg-blue-500 active:bg-blue-500 transition-all duration-100 cursor-pointer"
        onClick={() => submitVote(voteProps.voteDist)}
        disabled={useHandleDisabled()}
      >
        <p>{handleText()}</p>
      </button>
    </div>
    
  );
}
