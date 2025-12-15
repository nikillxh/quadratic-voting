"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { Transaction, TransactionButton, TransactionToast } from '@coinbase/onchainkit/transaction';
import { calls } from '@/calls';
import { Boxy } from "./components/boxy";
import VotingPanel from "./components/votepanel";
import { voteSubmit } from "./logic/votesubmit";
import { useState } from "react";
import VotingStats from "./components/votestats";


export default function Home() {

  const [canSubmit, setCanSubmit] = useState(false);

  return (
    <div className={styles.container}>
      <header className={styles.headerWrapper}>
        <Wallet />
      </header>

      <pre className="flex font-bold text-3xl justify-center pt-6">
        Vote if you want a hoodie </pre>
      <pre className="flex font-bold text-3xl justify-center pb-6">
      ( ๑‾̀◡‾́)(‾̀◡‾́ ๑)</pre>
        

      <div className="flex flex-wrap items-center justify-center gap-2 py-6">
        <Boxy title="Hoodie Alpha" src="/pikapika.png"/>
        <Boxy title="Hoodie Beta" src="/pikapika.png"/>
        <Boxy title="Hoodie Gamma" src="/pikapika.png"/>
      </div>

      <VotingStats onValidityChange={setCanSubmit} />

      <VotingPanel onValidityChange={setCanSubmit} />

      <div className="flex flex-grow items-center justify-center min-w-xl p-4 mx-auto my-6">
            <Transaction calls={calls}>
              <TransactionButton text="Submit Vote" disabled={!canSubmit}>
              </TransactionButton>
              <TransactionToast />
            </Transaction>
      </div>
    </div>
  );
}


