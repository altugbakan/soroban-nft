import { Button } from "@mantine/core";
import { useWalletContext } from "../../hooks/useWalletContext";

interface ConnectWalletProps {
  className: string;
}

export default function WalletButton({ className }: ConnectWalletProps) {
  const { address, connect } = useWalletContext();
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
