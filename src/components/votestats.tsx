"use client";

import { ItemProps } from "@/types/types";
import { QuadcandyVotes, QuadTotal } from "../app/calls";


export default function VotingStats({ items }: ItemProps) {
  return (
    <div className="flex flex-col justify-between px-4">
    
    <pre className="flex font-bold text-wrap text-base md:text-2xl justify-center pt-6">Vote Statistics</pre>

    <div className="mx-auto flex grow flex-col justify-between bg-black/30 p-6 m-4 rounded-lg border border-amber-100/20
    hover:bg-black/50 hover:border-2 transition duration-300 ease-in-out">
        
        <div className="flex grow flex-col justify-around pb-4">
            {items.map((item) => (
            <div key={item.id}
                className="grid grid-cols-2 gap-6 py-3 items-center text-center">
            
                <h2 className="text-white text-base md:text-xl font-light">
                {item.title}
                </h2>

                <pre className="text-base md:text-xl"><QuadcandyVotes id={item.id} /></pre>
            </div>
            ))}
        </div>


        <div className="pt-6 border-t border-neutral-700">
          <p className="text-white text-center text-base md:text-xl font-light">
            Total Votes:{" "}
            <span className="text-pink-400 text-base md:text-xl">
              <QuadTotal/>
            </span>
          </p>
        </div>
    </div>
    </div>

  );
}