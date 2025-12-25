import { createConfig, http } from "wagmi";
import { localhost, baseSepolia } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [localhost, baseSepolia],
  transports: {
    [localhost.id]: http("http://127.0.0.1:8545"),
    [84532]: http(), // Base Sepolia
  },
});
