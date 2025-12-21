import { useLeadingCandidate } from "../app/calls"

const candidateNames = ["Hoodie Alpha", "Hoodie Beta", "Hoodie Gamma", "Hoodie Delta", "Hoodie Sigma"];

export default function VoteResult(voteProps: {qvEnded?: boolean}) {
    var lead = useLeadingCandidate();
    if (lead === null) return (
        <div className={`flex font-bold text-wrap text-xl md:text-2xl justify-center lg:my-12 my-8
      border-gray-400 border-2 rounded-2xl lg:p-6 p-4 ${voteProps.qvEnded? 'bg-black/30' : '' }`}>
        <pre>Trump has the most votes lol</pre>
        </div>
    )

    return (
        <div className={`flex font-bold text-wrap text-xl md:text-2xl justify-center lg:my-12 my-8
      border-gray-400 border-2 rounded-2xl lg:p-6 p-4 ${voteProps.qvEnded? 'bg-black/30' : '' }`}>
        {voteProps.qvEnded ? (
        <pre>The winner is {candidateNames[Number(lead)]} ᯓ★</pre>
        ) : (
        <pre>{candidateNames[Number(lead)]} is taking the lead 𓐬</pre>
        )}
        </div>
    
    )
}