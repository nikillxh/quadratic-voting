"use client";

import styles from "./page.module.css";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { Boxy } from "../components/boxy";
import VotingPanel from "../components/votepanel";
import { useState } from "react";
import VotingStats from "../components/votestats";
import { useAccount, useChainId } from "wagmi";
import VoteButton from "../components/votebutton";
import { useQVEnded, useVoteStatus } from "./calls";
import VoteResult from "../components/voteresult";
import EventsButton from "@/components/eventbutton";
import { Footer } from "@/components/footer";
import { Item } from "@/types/types";

export default function Home() {
  const chainId = useChainId();
  const { address } = useAccount();

  console.log("chainId", chainId);

  const [canSubmit, setCanSubmit] = useState(false);

  const qvEnded = useQVEnded();
  const voteStatus = useVoteStatus(address ?? "0x0000000000000000000000000000000000000000");

  // Mini database lol
  const [items, setItems] = useState<Item[]>([
    { id: 0, title: "Soul Blue", votes: 0, src: "/hoodies/0. Soul Blue.png" },
    { id: 1, title: "The Cute One", votes: 0, src: "/hoodies/1. The cute one.png" },
    { id: 2, title: "White Dragon", votes: 0, src: "/hoodies/2. White Dragon.png" },
    { id: 3, title: "Blue", votes: 0, src: "/hoodies/4. Blue.png" },
    { id: 4, title: "White Soul", votes: 0, src: "/hoodies/5. White soul.jpeg" },
    { id: 5, title: "Purple Flames", votes: 0, src: "/hoodies/6. Purple Flames.jpeg" },
    { id: 6, title: "Purple Gamble", votes: 0, src: "/hoodies/8. Purple Gamble.jpeg" },
    { id: 7, title: "Whack a Mole", votes: 0, src: "/hoodies/10. Whack a Mole.jpeg" },
    { id: 8, title: "Flames Again", votes: 0, src: "/hoodies/11.Flames again.png" },
    { id: 9, title: "Again Flames", votes: 0, src: "/hoodies/12.Flames again.png" },
    { id: 10, title: "Blue Soul", votes: 0, src: "/hoodies/14. Blue Soul.png" },
    { id: 11, title: "White Gamble", votes: 0, src: "/hoodies/15. White Gamble.png" },
  ]);


  return (
    // Removed ${styles.container} from top div
    <div className={`mx-auto max-w-350 flex flex-col items-center`}>
      <header className={styles.headerWrapper}>
        <Wallet />
      </header>

      <pre className="flex font-bold text-wrap text-base md:text-2xl lg:text-3xl justify-center pt-6">
        Vote if you want a hoodie </pre>
      <pre className="flex font-bold text-base md:text-2xl lg:text-3xl justify-center pb-6">
        ( ๑‾̀◡‾́)(‾̀◡‾́ ๑)</pre>


      <div className="flex flex-wrap items-stretch justify-center gap-2 py-2 sm:py-6">
        {items.map((item) => 
        (<Boxy key={item.id} title={item.title} src={item.src}/>))}
      </div>

      <VoteResult qvEnded={qvEnded} items={items}/>


      <div className="flex flex-col items-center">
        <div className="flex md:flex-row flex-col flex-wrap max-w-240 justify-evenly gap-4">
          <VotingStats items={items} setItems={setItems}/>

          <VotingPanel onValidityChange={setCanSubmit} qvEnded={qvEnded} voteStatus={voteStatus}
            items={items} setItems={setItems} />
        </div>

        <div className="flex md:flex-row flex-col-reverse md:justify-stretch md:items-stretch md:gap-4 gap-8 md:my-12 my-8">
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
