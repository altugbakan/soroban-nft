import { Button, createStyles } from "@mantine/core";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  fundButton: {
    width: "200px",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[8]
        : theme.colors.gray[1],
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.gray[2]
        : theme.colors.gray[6],
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.gray[4]
          : theme.colors.gray[8],
    },
  },
}));

export interface FundButtonProps {
  address: string;
  handleFunded(): void;
}

export function FundButton({ address, handleFunded }: FundButtonProps) {
  const [funding, setFunding] = useState(false);
  const { classes } = useStyles();

  return (
    <Button
      className={classes.fundButton}
      disabled={funding}
      onClick={async () => {
        setFunding(true);
        await fetch(`https://friendbot-futurenet.stellar.org/?addr=${address}`);
        setTimeout(handleFunded, 2000);
      }}
    >
      {funding ? "Funding..." : "Fund Wallet"}
    </Button>
  );
}
