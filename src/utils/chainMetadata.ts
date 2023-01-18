import type { ChainMetadata } from "@soroban-react/types";
import { getDefaultConnectors } from "@soroban-react/core";
import {
  APP_NAME,
  FUTURENET_PASSPHRASE,
  STANDALONE_PASSPHRASE,
} from "./constants";

const chains: ChainMetadata[] = [
  {
    id: "futurenet",
    name: "Futurenet",
    networkPassphrase: FUTURENET_PASSPHRASE,
  },
  {
    id: "standalone",
    name: "Standalone",
    networkPassphrase: STANDALONE_PASSPHRASE,
  },
];

const { connectors } = getDefaultConnectors({
  appName: APP_NAME,
  chains,
});

export const chainMetadataProps = {
  chains: chains,
  appName: APP_NAME,
  connectors: connectors,
};
