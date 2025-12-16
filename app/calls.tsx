import { useReadContract } from 'wagmi';
import { writeContract } from 'wagmi/actions';

export const QVcontractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3" as `0x${string}`;

//////////////////////////////////////////////////////
////////////////// Order of ABIs /////////////////////
//////////////////////////////////////////////////////
// 1 // Quadratic Candidate Votes ABI (used Wagmi)
// 2 // Quadratic Vote Submit ABI (used onChainKit)
// 3 // Total Quadratic Votes ABI (used Wagmi)
// 4 // 


// 1 // Quadratic Candidate Votes ABI (used Wagmi)
const quadcandyVotesABI = [
  {
    type:"function",
    name:"quadcandyVotes",
    inputs:[{"name":"","type":"uint256","internalType":"uint256"}],
    outputs:[{"name":"","type":"uint256","internalType":"uint256"}],
    stateMutability:"view"
  }
] as const;

function useQuadcandyVotesABI (index: bigint) {
  return useReadContract({
    address: QVcontractAddress,
    abi: quadcandyVotesABI,
    functionName: "quadcandyVotes",
    args: [index],
  });
}

export function QuadcandyVotes({ id }: { id: number }) {
  const { data, isLoading, error } = useQuadcandyVotesABI(BigInt(id));

  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Error</div>;

  return <div>{data?.toString()}</div>;
}



// 2 // Quadratic Vote Submit ABI (used onChainKit)
const voteABI = [
  {
    type:"function",
    name:"vote",
    inputs:[{"name":"_votes","type":"uint256[]","internalType":"uint256[]"}],
    outputs:[{"name":"","type":"bool","internalType":"bool"}],
    stateMutability:"nonpayable"
  }
] as const;

export const getVoteCall = (votes: bigint[]) => ({
  address: QVcontractAddress,
  abi: voteABI,
  functionName: "vote",
  args: [votes],
});



// 3 // Total Quadratic Votes ABI (used Wagmi)
export const quadTotalABI = [
  {
    type: "function",
    name: "quadTotal",
    inputs: [],
    outputs: [{name: "",type: "uint256",internalType: "uint256",}],
    stateMutability: "view",
  },
] as const;

function useQuadTotalABI() {
  return useReadContract({
    address: QVcontractAddress,
    abi: quadTotalABI,
    functionName: "quadTotal",
  });
}

export function QuadTotal() {
  const { data, isLoading, error } = useQuadTotalABI();

  if (isLoading) return <span>Loading…</span>;
  if (error) return <span>Error</span>;

  return <span>{data?.toString()}</span>
}