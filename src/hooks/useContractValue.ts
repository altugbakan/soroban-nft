import { useState, useEffect } from "react";
import {
  Account,
  Contract,
  Server,
  TimeoutInfinite,
  TransactionBuilder,
  xdr,
} from "soroban-client";

export interface UseContractValueProps {
  address?: string;
  server?: Server;
  networkPassphrase?: string;
  contractId: string;
  func?: string;
  params?: xdr.ScVal[] | undefined;
}

export type UseContractValueType = {
  data?: xdr.ScVal;
  loading: boolean;
  error?: Error;
};

export function useContractValue({
  address,
  server,
  networkPassphrase,
  contractId,
  func,
  params,
}: UseContractValueProps): UseContractValueType {
  const [data, setData] = useState<xdr.ScVal | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    const contract = new Contract(contractId);

    async function getContractValue() {
      if (!address || !contractId || !server || !func) return;

      let account;

      try {
        account = await server.getAccount(address);
      } catch (error: any) {
        setLoading(false);
        setError(error ? new Error("Account missing.") : error);
      }

      if (!account) {
        return;
      }

      const tx = new TransactionBuilder(
        new Account(account.id, account.sequence),
        {
          fee: "100",
          networkPassphrase,
        }
      )
        .addOperation(contract.call(func, ...(params || [])))
        .setTimeout(TimeoutInfinite)
        .build();
      const { results } = await server.simulateTransaction(tx);
      setLoading(false);

      if (!results || results.length !== 1) {
        setError(new Error("Failed to get data."));
      }

      setData(
        results && xdr.ScVal.fromXDR(Buffer.from(results[0].xdr, "base64"))
      );
    }

    getContractValue();
  }, [address]);

  return { data, loading, error };
}
