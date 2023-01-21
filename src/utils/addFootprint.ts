import {
  Account,
  Operation,
  SorobanRpc,
  Transaction,
  TransactionBuilder,
  xdr,
} from "soroban-client";

export function addFootprint(
  raw: Transaction,
  networkPassphrase: string,
  footprint: SorobanRpc.SimulateTransactionResponse["footprint"]
): Transaction {
  const source = new Account(raw.source, `${parseInt(raw.sequence) - 1}`);
  const txn = new TransactionBuilder(source, {
    fee: raw.fee,
    memo: raw.memo,
    networkPassphrase,
    timebounds: raw.timeBounds,
    ledgerbounds: raw.ledgerBounds,
    minAccountSequence: raw.minAccountSequence,
    minAccountSequenceAge: raw.minAccountSequenceAge,
    minAccountSequenceLedgerGap: raw.minAccountSequenceLedgerGap,
    extraSigners: raw.extraSigners,
  });
  for (let rawOp of raw.operations) {
    if ("function" in rawOp) {
      txn.addOperation(
        Operation.invokeHostFunction({
          function: rawOp.function,
          parameters: rawOp.parameters,
          footprint: xdr.LedgerFootprint.fromXDR(footprint, "base64"),
        })
      );
    } else {
      throw new Error("Unsupported operation type");
    }
  }
  return txn.build();
}
