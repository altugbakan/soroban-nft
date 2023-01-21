import { useState, useEffect } from "react";
import {
  Account,
  Contract,
  Server,
  TimeoutInfinite,
  TransactionBuilder,
  xdr,
} from "soroban-client";
import {
  bigNumberToI128,
  scValToAccountString,
  scValToString,
} from "../utils/convert";
import BigNumber from "bignumber.js";

export type TokenValuesType = {
  owner: string;
  id: number;
  uri: string;
  name: string;
};

export interface UseTokenValueProps {
  address?: string;
  server?: Server;
  networkPassphrase?: string;
  contractId: string;
}

export type UseTokenValuesType = {
  data?: TokenValuesType[];
  loading: boolean;
  error?: Error;
};

const getNameFromUri = (uri: string) => {
  const name = uri.replace("images/", "").replace(".png", "");
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export function useTokenValues({
  address,
  server,
  networkPassphrase,
  contractId,
}: UseTokenValueProps): UseTokenValuesType {
  const [data, setData] = useState<TokenValuesType[] | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    const contract = new Contract(contractId);

    async function getTokenData(
      tokenId: number
    ): Promise<TokenValuesType | Error> {
      if (!address || !contractId || !server)
        return new Error("Invalid configuration.");

      const account = await server.getAccount(address);
      let tx = new TransactionBuilder(
        new Account(account.id, account.sequence),
        {
          fee: "100",
          networkPassphrase,
        }
      )
        .addOperation(
          contract.call("token_uri", bigNumberToI128(new BigNumber(tokenId)))
        )
        .setTimeout(TimeoutInfinite)
        .build();

      const uriResponse = await server.simulateTransaction(tx);

      if (!uriResponse.results || uriResponse.results.length !== 1) {
        return new Error("Failed to get URI data.");
      }

      const uri = scValToString(
        xdr.ScVal.fromXDR(Buffer.from(uriResponse.results[0].xdr, "base64"))
      );

      if (!uri) {
        return new Error("Failed to convert URI data.");
      }

      tx = new TransactionBuilder(new Account(account.id, account.sequence), {
        fee: "100",
        networkPassphrase,
      })
        .addOperation(
          contract.call("owner", bigNumberToI128(new BigNumber(tokenId)))
        )
        .setTimeout(TimeoutInfinite)
        .build();

      const ownerResponse = await server.simulateTransaction(tx);

      if (!ownerResponse.results || ownerResponse.results.length !== 1) {
        return new Error("Failed to get owner data.");
      }

      const owner = scValToAccountString(
        xdr.ScVal.fromXDR(Buffer.from(ownerResponse.results[0].xdr, "base64"))
      );

      if (!owner) {
        return new Error("Failed to convert owner data.");
      }

      return { owner, uri, id: tokenId, name: getNameFromUri(uri) };
    }

    async function getAllTokens() {
      let results = new Array<TokenValuesType>();

      for (let i = 1; ; ++i) {
        const result = await getTokenData(i);
        if (result instanceof Error) {
          if (i === 1) {
            setError(new Error("Could not retrieve token data."));
          }

          break;
        }

        results = results.concat(result);
      }

      setData(results);
      setLoading(false);
    }

    getAllTokens();
  }, [address]);

  return { data, loading, error };
}
