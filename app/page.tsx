"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { Transaction } from '@coinbase/onchainkit/transaction';
import { calls } from '@/calls';


export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.headerWrapper}>
        <Wallet />
      </header>

      <div className="flex flex-grow items-center justify-center">
      <div className="w-full max-w-4xl p-4">
        <div className="mx-auto mb-6 w-1/3">
          <Transaction calls={calls} />
        </div>
      </div>
    </div>
    </div>
  );
}
