import { Button } from "@mantine/core";
import { signTransaction } from "@stellar/freighter-api";
import { useState } from "react";
import {
  Account,
  Contract,
  TimeoutInfinite,
  TransactionBuilder,
} from "soroban-client";
import { useWalletContext } from "../../hooks/useWalletContext";
import { addFootprint } from "../../utils/addFootprint";
import { DELAY, MAX_POLL } from "../../utils/constants";

export interface MintButtonProps {
  className: string;
  contractId: string;
  handleMinted(): void;
}

export function MintButton({
  contractId,
  className,
  handleMinted,
}: MintButtonProps) {
  const { address, server, networkDetails } = useWalletContext();
  const [minting, setMinting] = useState(false);

  const mint = async () => {
    if (!address || !server || !networkDetails)
      throw new Error("No account or server");

    setMinting(true);

    const account = await server.getAccount(address);

    let tx = new TransactionBuilder(new Account(account.id, account.sequence), {
      fee: "100",
      networkPassphrase: networkDetails.networkPassphrase,
    })
      .addOperation(new Contract(contractId).call("mint_next"))
      .setTimeout(TimeoutInfinite)
      .build();

    const { footprint } = await server.simulateTransaction(tx);
    tx = addFootprint(tx, networkDetails.networkPassphrase, footprint);

    const signed = await signTransaction(tx.toXDR(), {
      networkPassphrase: networkDetails.networkPassphrase,
    });

    const toSubmit = TransactionBuilder.fromXDR(
      signed,
      networkDetails.networkPassphrase
    );

    const { id } = await server.sendTransaction(toSubmit);

    for (let i = 0; i < MAX_POLL; i++) {
      const response = await server.getTransactionStatus(id);

      if (response.status === "error") return;

      if (response.status === "success") {
        handleMinted();
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, DELAY));
    }
  };

  return (
    <Button onClick={mint} className={className} disabled={minting}>
      {minting ? "Minting..." : "Mint Now"}
    </Button>
  );
}
