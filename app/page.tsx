"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { Transaction, TransactionButton, TransactionToast } from '@coinbase/onchainkit/transaction';
import { Boxy } from "./components/boxy";
import VotingPanel, { votes } from "./components/votepanel";
import { useEffect, useState } from "react";
import VotingStats from "./components/votestats";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import VoteButton from "./components/votebutton";
import { useQVEnded, useVoteStatus } from "./calls";
import VoteResult from "./components/voteresult";

export default function Home() {
  const chainId = useChainId();
  const { address } = useAccount();

  console.log("chainId", chainId);

  const [canSubmit, setCanSubmit] = useState(false);

  const qvEnded = useQVEnded();
  const voteStatus = useVoteStatus(address ?? "0x0000000000000000000000000000000000000000");

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
        <Boxy title="Hoodie Alpha" src="/pikapika.png"/>
        <Boxy title="Hoodie Beta" src="/pikapika.png"/>
        <Boxy title="Hoodie Gamma" src="/pikapika.png"/>
        <Boxy title="Hoodie Delta" src="/pikapika.png"/>
        <Boxy title="Hoodie Sigma" src="/pikapika.png"/>
      </div>
      
      <div className="flex font-bold text-wrap text-2xl lg:text-3xl justify-center lg:my-12 my-8
      border-gray-400 border-2 rounded-2xl lg:p-6 p-4">
        <VoteResult qvEnded={qvEnded}/>
      </div>

      <div className="flex flex-row flex-wrap mx-auto max-w-240 justify-evenly gap-4">
        <VotingStats />

        <VotingPanel onValidityChange={setCanSubmit} qvEnded={qvEnded} voteStatus={voteStatus}/>
      </div>

      {/* <div className="flex items-center justify-center min-w-md sm:min-w-xl p-4 mx-auto my-6">
            <Transaction calls={[getVoteCall(votes)]}>
              <TransactionButton text="Submit Vote" disabled={!canSubmit}>
              </TransactionButton>
              <TransactionToast />
            </Transaction>
      </div> */}
      <VoteButton canSubmit={canSubmit} voteDist={votes} qvEnded={qvEnded}/>
    </div>
  );
}