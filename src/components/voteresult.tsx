import { Item } from "@/types/types";
import { useLeadingCandidate } from "../app/calls"



export default function VoteResult(voteProps: {qvEnded?: boolean, items: Item[]}) {
    const lead = Number(useLeadingCandidate());


    if ((lead === null || undefined) || (voteProps.items[lead] == undefined)) return (
        <div className={`flex font-bold text-base md:text-2xl lg:text-3xl justify-center lg:my-12 my-8 mx-4 md:mx-8
      border-gray-400 border-2 rounded-2xl lg:p-6 p-4 ${voteProps.qvEnded? 'bg-black/30' : '' }`}>
        <pre className="text-wrap">Trump has the most votes lol</pre>
        </div>
    )

    return (
        <div className={`flex font-bold text-base md:text-2xl lg:text-3xl justify-center lg:my-12 my-8 mx-4 md:mx-8
      border-gray-400 border-2 rounded-2xl lg:p-6 p-4 ${voteProps.qvEnded? 'bg-black/30' : '' }`}>
        {voteProps.qvEnded ? (
        <pre>The winner is {voteProps.items[lead].title} ᯓ★</pre>
        ) : (
        <pre className="text-wrap">{voteProps.items[lead].title} is taking the lead 𓐬</pre>
        )}
        </div>
    
    )
}