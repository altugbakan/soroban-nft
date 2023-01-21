import { useWalletContext } from "../../hooks/useWalletContext";
import { CONTRACT_ID } from "../../utils/constants";
import { TokenValuesType, useTokenValues } from "../../hooks/useTokenValues";
import { TokenCarousel } from "../interface/TokenCarousel";
import { TokenCard } from "../interface/TokenCard";
import { createStyles } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

const useStyles = createStyles({
  page: {
    display: "flex",
    flexDirection: "column",
    placeItems: "center",
    gap: "20px",
  },
  carousel: {
    maxWidth: "60vw",
  },
});

export function AfterMintPage() {
  const { classes } = useStyles();

  const { address, networkDetails, server } = useWalletContext();

  if (!address) return null;

  const [savedToken, setSavedToken] = useLocalStorage<
    TokenValuesType | undefined
  >({
    key: address,
    defaultValue: undefined,
  });

  const { loading, error, data } = useTokenValues({
    address: address,
    contractId: CONTRACT_ID,
    server,
    networkPassphrase: networkDetails?.networkPassphrase,
  });

  if (!savedToken && loading) return <h1>Loading your token...</h1>;

  if (!savedToken && error) return <h1>Failed to load tokens.</h1>;

  let userToken: TokenValuesType | undefined = savedToken;

  if (data) {
    data?.forEach((token) => {
      if (token.owner === address) {
        userToken = token;
        savedToken || setSavedToken(token);
      }
    });
  }

  if (!userToken) return <h1>Failed to load your token.</h1>;

  return (
    <div className={classes.page}>
      <h1>Successfully minted!</h1>
      {savedToken ? (
        <TokenCard
          uri={savedToken.uri}
          owner={savedToken.owner}
          id={savedToken.id}
          name={savedToken.name}
        />
      ) : null}
      {data ? (
        <>
          <h3>Tokens minted by others</h3>
          <div className={classes.carousel}>
            <TokenCarousel tokens={data} />
          </div>
        </>
      ) : null}
    </div>
  );
}
