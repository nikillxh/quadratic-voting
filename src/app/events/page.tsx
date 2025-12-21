"use client";

import { Wallet } from "@coinbase/onchainkit/wallet";
import styles from ".././page.module.css";
import { QVEventTimeline } from "@/components/eventlist";
import { HomeButton } from "@/components/homebutton";
import { Footer } from "@/components/footer";

export default function Home() {
  return ( 
  <div className={`mx-auto max-w-350 flex flex-col items-center min-h-screen`}>
    <header className={`flex justify-evenly w-full pt-6`}>
      <HomeButton />
      <Wallet />
    </header>
    <pre className="flex font-bold text-wrap text-2xl lg:text-3xl justify-center p-6">
        Events </pre>

    <QVEventTimeline />
    <div className="my-auto"></div>
    <Footer />
  </div>
  )
}
