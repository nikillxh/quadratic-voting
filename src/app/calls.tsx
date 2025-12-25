import { parseEventLogs, PublicClient } from 'viem';
import { useReadContract } from 'wagmi';

// export const QVcontractAddress = process.env.CONTRACT_ADDRESS as `0x${string}`;

export const QVcontractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;


//////////////////////////////////////////////////////
////////////////// Order of ABIs /////////////////////
//////////////////////////////////////////////////////
// 1 // Quadratic Candidate Votes ABI (used Wagmi)
// 2 // Quadratic Vote Submit ABI (used Wagmi)
// 3 // Total Quadratic Votes ABI (used Wagmi)
// 4 // Quadratic Voting Ended ABI (used Wagmi)
// 5 // Leading Candidate ABI (used Wagmi)
// 6 // Candidate Vote Status (used Wagmi)
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////


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

  const fraction = data ? (data % 1_000_000n) / 1_000n : 0n;
  const votes = data ? data / 1_000_000n : 0n;
  return <div>{votes}.{fraction.toString().padStart(3, "0")}</div>;
}



// 2 // Quadratic Vote Submit ABI (used Wagmi)
export const voteABI = [
  {
    type:"function",
    name:"vote",
    inputs:[{name:"_votes",type:"uint256[]",internalType:"uint256[]"}],
    outputs:[{name:"",type:"bool",internalType:"bool"}],
    stateMutability:"nonpayable"
  }
] as const;




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

  const fraction = data ? (data % 1_000_000n) / 1_000n : 0n;
  const votes = data ? data / 1_000_000n : 0n;
  return <span>{votes}.{fraction.toString().padStart(3, "0")}</span>
}



// 4 // Quadratic Voting Ended ABI (used Wagmi)
export const QVendedABI = [
  {
    type: "function",
    name: "QVended",
    inputs: [],
    outputs: [{name: "",type: "bool",internalType: "bool"}],
    stateMutability: "view",
  },
] as const;

export function useQVEnded(): boolean {
  const { data } = useReadContract({
    address: QVcontractAddress,
    abi: QVendedABI,
    functionName: "QVended",
  });

  return data ?? false; // default: not ended
}



// 5 // Leading Candidate ABI (used Wagmi)
export const leadingCandidateABI = [
  {
    type: "function",
    name: "leadingCandidate",
    inputs: [],
    outputs: [{name: "",type: "uint256",internalType: "uint256",}],
    stateMutability: "view",
  },
] as const;

export function useLeadingCandidate(): bigint | null {
  const { data, isLoading } = useReadContract({
    address: QVcontractAddress,
    abi: leadingCandidateABI,
    functionName: "leadingCandidate",
  });

  if (isLoading) return null;
  return data!;
}



// 6 // Candidate Vote Status (used Wagmi)
export const voteStatusABI = [
  {
    type: "function",
    name: "voteStatus",
    inputs: [{name: "",type: "address",internalType: "address",}],
    outputs: [{name: "",type: "uint8",internalType: "uint8",}],
    stateMutability: "view",
  },
] as const;

export function useVoteStatus(address: `0x${string}`): number {
  const { data } = useReadContract({
    address: QVcontractAddress,
    abi: voteStatusABI,
    functionName: "voteStatus",
    args: [address],
  });

  return data ?? 0;
}



// 7 // Events ABI
export const EventsABI = [
  {
    type: "event",
    name: "VoteAccessGranted",
    inputs: [
      { name: "overseer", type: "address", indexed: true },
      { name: "voter", type: "address", indexed: true },
    ],
  },
  {
    type: "event",
    name: "Voted",
    inputs: [
      { name: "voter", type: "address", indexed: true },
      { name: "votes", type: "uint256[]", indexed: false },
    ],
  },
] as const;


export async function fetchAllEvents(client: PublicClient) {
  const rawLogs = await client.getLogs({
    address: QVcontractAddress,
    fromBlock: 35439153n,
    toBlock: "latest",
  });

  const parsedLogs = parseEventLogs({
    abi: EventsABI,
    logs: rawLogs,
  });

  return parsedLogs;
}