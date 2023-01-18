import { Button, createStyles } from "@mantine/core";
import { useAccount } from "../hooks/useAccount";
import ConnectWallet from "./ConnectWallet";

const useStyles = createStyles(() => ({
  page: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
  },
  button: {},
}));

export function MainPage() {
  const account = useAccount();
  const minted = false;
  const { classes } = useStyles();

  if (!account) {
    return (
      <div className={classes.page}>
        <h1>Soroban NFTs</h1>
        <p>NFTs on Stellar Chain using Soroban network.</p>
        <ConnectWallet className={classes.button} />
      </div>
    );
  }

  if (!minted) {
    return (
      <div className={classes.page}>
        <h1>Mint your NFT!</h1>
        <Button>Mint NFT</Button>
        <p>Get one of three cute puppies!</p>
      </div>
    );
  }

  return <h1>Connected</h1>;
}
