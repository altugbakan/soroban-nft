import { createStyles } from "@mantine/core";
import { CONTRACT_ID, SAMPLE_TOKENS } from "../../utils/constants";
import { MintButton } from "../interface/MintButton";
import { TokenCarousel } from "../interface/TokenCarousel";

const useStyles = createStyles((theme) => ({
  page: {
    display: "flex",
    flexDirection: "column",
    placeItems: "center",
    gap: "20px",
  },
  connectButton: {
    width: "200px",
  },
  freighterButton: {
    width: "200px",
    backgroundColor: theme.colors.violet[4],
    "&:hover": {
      backgroundColor: theme.colors.violet[9],
    },
  },
  carousel: {
    maxWidth: "60vw",
  },
  mintButton: {
    width: "200px",
  },
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

export interface BeforeMintPageProps {
  handleMinted(): void;
}

export function BeforeMintPage({ handleMinted }: BeforeMintPageProps) {
  const { classes } = useStyles();

  return (
    <div className={classes.page}>
      <h1>Mint your NFT!</h1>
      <MintButton
        contractId={CONTRACT_ID}
        className={classes.mintButton}
        handleMinted={handleMinted}
      />
      <p>Get one of the nine possible dogs!</p>
      <div className={classes.carousel}>
        <TokenCarousel tokens={SAMPLE_TOKENS} />
      </div>
    </div>
  );
}
