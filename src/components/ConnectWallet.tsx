import { Button } from "@mantine/core";
import { useSorobanReact } from "@soroban-react/core";

interface ConnectWalletProps {
  className: string;
}

export default function ConnectWallet({ className }: ConnectWalletProps) {
  const { connect, address } = useSorobanReact();
  return (
    <Button
      onClick={async () => !address && (await connect())}
      className={className}
    >
      {address
        ? `${address.slice(0, 4)}...${address.slice(-4)}`
        : "Connect Wallet"}
    </Button>
  );
}
