"use client";

import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { wagmiConfig } from "./wagmi";
import { baseSepolia } from "wagmi/chains";

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <OnchainKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        chain={baseSepolia}
        config={{
          appearance: {
            mode: "auto",
          },
          wallet: {
            display: "modal",
            preference: "all",
          },
        }}
      >
        {children}
      </OnchainKitProvider>
    </WagmiProvider>
  );
}
