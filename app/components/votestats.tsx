"use client";

import { useEffect, useState } from "react";

type Item = {
  id: number;
  title: string;
  votes: number;
};

type VotingStatsProps = {
  onValidityChange?: (isValid: boolean) => void;
};

const MAX_VOTES = 100;


export default function VotingStats({ onValidityChange }: VotingStatsProps) {
  const [items, setItems] = useState<Item[]>([
    { id: 1, title: "Hoodie Alpha", votes: 0 },
    { id: 2, title: "Hoodie Beta", votes: 0 },
    { id: 3, title: "Hoodie Gamma", votes: 0 },
  ]);

  const totalVotes = items.reduce((sum, i) => sum + i.votes, 0);
  const votesLeft = MAX_VOTES - totalVotes;

  const isValid = votesLeft === 0;

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);


  const updateVotes = (id: number, value: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const otherVotes = totalVotes - item.votes;

        const clamped = Math.max(
          0,
          Math.min(value, MAX_VOTES - otherVotes)
        );

        return { ...item, votes: clamped };
      })
    );
  };

  return (
    <div className="mx-auto bg-black/30 p-6 m-4 rounded-lg border border-amber-100/20
    hover:bg-black/50 hover:border-2 transition duration-300 ease-in-out">
      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-2 gap-6 items-center text-center"
          >
            <h2 className="text-white text-2xl font-light">
              {item.title}
            </h2>

            <pre>_</pre>
          </div>
        ))}

        <div className="pt-6 border-t border-neutral-700">
          <p className="text-white text-center text-2xl font-light">
            Votes Left:{" "}
            <span className="text-violet-400">
              {votesLeft}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}