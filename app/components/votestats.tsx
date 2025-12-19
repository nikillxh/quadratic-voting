"use client";

import { QuadcandyVotes, QuadTotal } from "@/calls";
import { useEffect, useState } from "react";

type Item = {
  id: number;
  title: string;
  votes: number;
};

export default function VotingStats() {
  const items = [
    { id: 0, title: "Hoodie Alpha", votes: 0 },
    { id: 1, title: "Hoodie Beta", votes: 0 },
    { id: 2, title: "Hoodie Gamma", votes: 0 },
    { id: 3, title: "Hoodie Delta", votes: 0 },
    { id: 4, title: "Hoodie Sigma", votes: 0 }];

  return (
    <div className="flex flex-col justify-between px-4">
    
    <pre className="flex font-bold text-2xl justify-center pt-6">Vote Statistics</pre>

    <div className="mx-auto flex grow flex-col justify-between bg-black/30 p-6 m-4 rounded-lg border border-amber-100/20
    hover:bg-black/50 hover:border-2 transition duration-300 ease-in-out">
        
        <div className="flex grow flex-col justify-around pb-4">
            {items.map((item) => (
            <div key={item.id}
                className="grid grid-cols-2 gap-6 items-center text-center">
            
                <h2 className="text-white text-xl font-light">
                {item.title}
                </h2>

                <pre className="text-xl"><QuadcandyVotes id={item.id} /></pre>
            </div>
            ))}
        </div>


        <div className="pt-6 border-t border-neutral-700">
          <p className="text-white text-center text-xl font-light">
            Total Votes:{" "}
            <span className="text-pink-400 text-xl">
              <QuadTotal/>
            </span>
          </p>
        </div>
    </div>
    </div>

  );
}