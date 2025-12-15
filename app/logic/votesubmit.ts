type Votes = number[];

export function voteSubmit(votes: Votes) {
    const sum = votes.reduce((a, b) => a + b, 0);

    if (sum !== 100) {
        throw new Error("Son o");
    }
}