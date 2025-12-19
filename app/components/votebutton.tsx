import { QVcontractAddress, useQVEnded, voteABI } from "@/calls";
import { useWriteContract } from "wagmi";

export default function VoteButton(voteProps: { canSubmit: boolean, voteDist: bigint[], qvEnded?: boolean }) {
  const { writeContract, isPending, error } = useWriteContract();

  function submitVote(votes: bigint[]) {
    writeContract({
      address: QVcontractAddress,
      abi: voteABI,
      functionName: "vote",
      args: [votes],
    });
  }
  
  function handleText() {
    var qvEnded = useQVEnded();
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

  function handleDisabled() {
    var qvEnded = useQVEnded();
    return !voteProps.canSubmit || qvEnded || isPending;
  }

  return (
    <div >
    <button className="bg-blue-700 text-xl font-semibold min-w-md sm:min-w-xl p-4 mx-auto my-8 rounded-2xl
      disabled:bg-blue-300/30 disabled:cursor-default disabled:text-gray-400
    hover:bg-blue-500 active:bg-blue-500 transition-all duration-100 cursor-pointer"
      onClick={() => submitVote(voteProps.voteDist)}
      disabled={handleDisabled()}
    >
      <p>{handleText()}</p>
    </button>
    </div>
    
  );
}
