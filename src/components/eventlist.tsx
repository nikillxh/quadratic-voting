import { fetchAllEvents } from "@/app/calls";
import { useState, useEffect } from "react";
import { usePublicClient } from "wagmi";


export function QVEventTimeline() {
  const events = useQVTimeline();

  return (
    <div className="space-y-3">
      {events.map((e, i) => {
        const txUrl = getTxUrl(e.transactionHash);

        if (e.eventName === "VoteAccessGranted") {
          return (
            <pre 
            key={i} 
            onClick={() => txUrl && window.open(txUrl, "_blank")}
            className="font-mono text-amber-400 border border-neutral-700 rounded-lg p-4 bg-black/40
            flex lg:flex-row flex-col items-center justify-center
            hover:bg-black/20 hover:border-2 transition duration-300 ease-in-out cursor-pointer">
              <pre>🗝️ Vote access granted to </pre> <pre>{e.args.voter}</pre>
            </pre>
          );
        }

        if (e.eventName === "Voted") {
          return (
            <div 
            key={i} 
            onClick={() => txUrl && window.open(txUrl, "_blank")}
            className="font-mono text-green-400 border border-neutral-700 rounded-lg p-4 bg-black/40
            flex lg:flex-row flex-col items-center justify-center
            hover:bg-black/20 hover:border-2 transition duration-300 ease-in-out cursor-pointer">
              <pre>🗳️ {e.args.voter}</pre> <pre> voted:
              {e.args.votes.map((v: bigint, idx: number) => (
                <span key={idx} className="ml-2">
                  [{idx}]{v.toString()}
                </span>
              ))}</pre>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}


export function useQVTimeline() {
  const client = usePublicClient();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!client) return;

    async function load() {
      const logs = await fetchAllEvents(client);
      setEvents(sortLogs(logs));
    }

    load();
  }, [client]);

  return events;
}


function sortLogs(logs: any[]) {
  return logs.sort((a, b) => {
    if (a.blockNumber !== b.blockNumber)
      return Number(a.blockNumber - b.blockNumber);

    if (a.transactionIndex !== b.transactionIndex)
      return Number(a.transactionIndex - b.transactionIndex);

    return Number(a.logIndex - b.logIndex);
  });
}

function getTxUrl(txHash: string) {
  const base = "https://sepolia.basescan.org";
  if (!base) return null;
  return `${base}/tx/${txHash}`;
}
