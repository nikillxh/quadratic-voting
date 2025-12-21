import { createConfig, http } from "wagmi";
import { localhost, base } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [localhost, base],
  transports: {
    [localhost.id]: http("http://127.0.0.1:8545"),
    [base.id]: http(),
  },
});
