"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { Transaction, TransactionButton, TransactionToast } from '@coinbase/onchainkit/transaction';
import { Boxy } from "./components/boxy";
import VotingPanel, { votes } from "./components/votepanel";
import { voteSubmit } from "./logic/votesubmit";
import { useEffect, useState } from "react";
import VotingStats from "./components/votestats";
import { useChainId, useSwitchChain } from "wagmi";
import { getVoteCall } from "./calls";

export default function Home() {
  const chainId = useChainId();

  console.log("chainId", chainId);

  const [canSubmit, setCanSubmit] = useState(false);

  return (
    <div className={`${styles.container} mx-auto max-w-350 flex flex-col items-center`}>
      <header className={styles.headerWrapper}>
        <Wallet />
      </header>

      <pre className="flex font-bold text-wrap text-3xl justify-center pt-6">
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

      <div className="flex flex-row flex-wrap justify-evenly gap-4">
        <VotingStats />

        <VotingPanel onValidityChange={setCanSubmit} />
      </div>

      <div className="flex items-center justify-center min-w-xl p-4 mx-auto my-6">
            <Transaction calls={[getVoteCall(votes)]}>
              <TransactionButton text="Submit Vote" disabled={!canSubmit}>
              </TransactionButton>
              <TransactionToast />
            </Transaction>
      </div>
    </div>
  );
}