"use client";

import { Item } from "@/types/types";
import { useEffect } from "react";

type VotingPanelProps = {
  onValidityChange?: (isValid: boolean) => void;
  qvEnded?: boolean;
  voteStatus?: number;
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
};

const MAX_VOTES = 100;


export default function VotingPanel({ onValidityChange, qvEnded, voteStatus, items, setItems }: VotingPanelProps) {
  console.log("QV Ended:", qvEnded);

  const totalVotes = items.reduce((sum, i) => sum + i.votes, 0);
  const votesLeft = MAX_VOTES - totalVotes;

  useEffect(() => {
    onValidityChange?.(votesLeft === 0);
  }, [votesLeft, onValidityChange]);

  const updateVotes = (id: number, raw: number) => {
    setItems(prev => {
      const totalWithoutThis =
        prev.reduce((sum, i) => sum + i.votes, 0) - prev[id].votes;

      const clamped = Math.max(
        0,
        Math.min(raw, MAX_VOTES - totalWithoutThis)
      );

      return prev.map(item =>
        item.id === id ? { ...item, votes: clamped } : item
      );
    });
  };

  return (
    <div className="flex flex-col justify-between px-4">
    
    <pre className="flex font-bold text-2xl justify-center pt-6">Voting Panel</pre>

    <div className="mx-auto bg-black/30 p-6 m-4 rounded-lg border border-amber-100/20
    hover:bg-black/50 hover:border-2 transition duration-300 ease-in-out">
      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-2 gap-6 items-center text-center"
          >
            <h2 className="text-white text-xl font-light">
              {item.title}
            </h2>

            <input
              type="number"
              value={item.votes == 0? "": item.votes}
              onChange={(e) => {
                const value = Number(e.target.value || 0);
                updateVotes(item.id, value);
              }}
              className="bg-neutral-800 max-w-32 text-white text-xl text-center p-2 rounded-md outline-none focus:ring-2 focus:ring-violet-500
              transition duration-500 ease-in-out"
              placeholder={!qvEnded && voteStatus == 1? "0" : "𓃵"}
              disabled={!qvEnded && voteStatus == 1? false : true}
            />
          </div>
        ))}

        <div className="pt-6 border-t border-neutral-700">
          {qvEnded ? (
            <p className="text-green-500 text-center text-xl font-light">
              Voting ended
            </p>
            ):(
            voteStatus == 0 ? (
              <pre className="text-amber-500 text-center text-xl font-light">
                Not a voter</pre>
            ) : voteStatus === 1 ? (
            <p className="text-white text-center text-xl font-light">
              Votes Left:{" "}
              <span className="text-violet-400">{votesLeft}</span>
            </p>) : (
              <pre className="text-cyan-500 text-center text-xl font-light">
                Already Voted!</pre>
            )
          )}
        </div>
      </div>
    </div>

    </div>
  );
}