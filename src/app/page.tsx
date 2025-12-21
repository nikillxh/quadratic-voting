"use client";

import styles from "./page.module.css";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { Boxy } from "../components/boxy";
import VotingPanel from "../components/votepanel";
import { useState } from "react";
import VotingStats from "../components/votestats";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import VoteButton from "../components/votebutton";
import { useQVEnded, useVoteStatus } from "./calls";
import VoteResult from "../components/voteresult";
import EventsButton from "@/components/eventbutton";
import { Footer } from "@/components/footer";

export default function Home() {
  const chainId = useChainId();
  const { address } = useAccount();

  console.log("chainId", chainId);

  const [canSubmit, setCanSubmit] = useState(false);

  const qvEnded = useQVEnded();
  const voteStatus = useVoteStatus(address ?? "0x0000000000000000000000000000000000000000");

  // Mini database lol
  const [items, setItems] = useState<Item[]>([
    { id: 0, title: "Hoodie Alpha", votes: 0 },
    { id: 1, title: "Hoodie Beta", votes: 0 },
    { id: 2, title: "Hoodie Gamma", votes: 0 },
    { id: 3, title: "Hoodie Delta", votes: 0 },
    { id: 4, title: "Hoodie Epsilon", votes: 0 },
  ]);

  return (
    // Removed ${styles.container} from top div
    <div className={`mx-auto max-w-350 flex flex-col items-center`}>
      <header className={styles.headerWrapper}>
        <Wallet />
      </header>

      <pre className="flex font-bold text-wrap text-2xl lg:text-3xl justify-center pt-6">
        Vote if you want a hoodie </pre>
      <pre className="flex font-bold text-3xl justify-center pb-6">
        ( ๑‾̀◡‾́)(‾̀◡‾́ ๑)</pre>


      <div className="flex flex-wrap items-center justify-center gap-2 py-6">
        <Boxy title="Hoodie Alpha" src="/pikapika.png" />
        <Boxy title="Hoodie Beta" src="/pikapika.png" />
        <Boxy title="Hoodie Gamma" src="/pikapika.png" />
        <Boxy title="Hoodie Delta" src="/pikapika.png" />
        <Boxy title="Hoodie Sigma" src="/pikapika.png" />
      </div>

      <div className="flex font-bold text-wrap text-xl md:text-2xl justify-center lg:my-12 my-8
      border-gray-400 border-2 rounded-2xl lg:p-6 p-4">
        <VoteResult qvEnded={qvEnded} />
      </div>


      <div className="flex flex-col items-stretch">
        <div className="flex lg:flex-row flex-col flex-wrap mx-auto max-w-240 justify-evenly gap-4">
          <VotingStats />

          <VotingPanel onValidityChange={setCanSubmit} qvEnded={qvEnded} voteStatus={voteStatus}
            items={items} setItems={setItems} />
        </div>

        <div className="flex lg:flex-row flex-col-reverse max-w-240 md:justify-stretch items-stretch lg:gap-4 gap-8 lg:my-12 my-8">
          <EventsButton />
          <VoteButton canSubmit={canSubmit} voteDist={collectVotes(items)} qvEnded={qvEnded} />
        </div>
      </div>
    <div className="my-auto"></div>
    <Footer />
    </div>
  );
}

function collectVotes(items: Item[]): bigint[] {
  return items.map(item => BigInt(item.votes));
}
