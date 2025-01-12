import { http, injected } from "@wagmi/core";
import { createConfig } from "@wagmi/core";
import { localhost } from "./constants/chains";

export const apiEndpoint = `http://localhost:3333/api/v1`;

export const config = createConfig({
  chains: [localhost],
  connectors: [injected()],
  transports: { [localhost.id]: http() },
});
