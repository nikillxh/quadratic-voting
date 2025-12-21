import { useLeadingCandidate } from "../app/calls"

const candidateNames = ["Hoodie Alpha", "Hoodie Beta", "Hoodie Gamma", "Hoodie Delta", "Hoodie Sigma"];

export default function VoteResult(voteProps: {qvEnded?: boolean}) {
    var lead = useLeadingCandidate();
    if (lead === null) return <pre>Trump has the most votes lol</pre>;

    return (
        voteProps.qvEnded ? (
        <pre>The winner is {candidateNames[Number(lead)]} ᯓ★</pre>
        ) : (
        <pre>{candidateNames[Number(lead)]} is taking the lead 𓐬</pre>
    )
    )
}