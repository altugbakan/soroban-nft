import { Button, createStyles } from "@mantine/core";
import { isConnected } from "@stellar/freighter-api";
import { APP_NAME, SHADOW_DARK, SHADOW_LIGHT } from "../../utils/constants";
import WalletButton from "../interface/WalletButton";

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
  logoContainer: {
    width: "128px",
    height: "128px",
    position: "relative",
  },
  logo: {
    width: "100%",
  },
  logoText: {
    fontSize: "64px",
    fontWeight: "bold",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -90%)",
    color: theme.colorScheme === "dark" ? theme.white : theme.colors.gray[5],
    textShadow: theme.colorScheme === "dark" ? SHADOW_LIGHT : SHADOW_DARK,
  },
}));

export function InitialPage() {
  const { classes } = useStyles();

  return (
    <div className={classes.page}>
      <div className={classes.logoContainer}>
        <img src="/images/logo.png" className={classes.logo} />
        <p className={classes.logoText}>{APP_NAME}</p>
      </div>
      <p>NFTs on Stellar Chain using Soroban network.</p>
      {isConnected() ? (
        <WalletButton className={classes.connectButton} />
      ) : (
        <Button
          className={classes.freighterButton}
          onClick={() => window.open("https://www.freighter.app/", "_blank")}
        >
          Get Freighter
        </Button>
      )}
    </div>
  );
}
