import { createStyles, Header, Container, Group } from "@mantine/core";
import { WalletButton } from "./WalletButton";

const HEADER_HEIGHT = 60;

const useStyles = createStyles({
  inner: {
    height: HEADER_HEIGHT,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export function NavBar() {
  const { classes } = useStyles();

  return (
    <Header height={HEADER_HEIGHT} sx={{ borderBottom: 0 }} mb={120}>
      <Container className={classes.inner} fluid>
        <Group>
          <h3>Soroban NFTs</h3>
        </Group>
        <WalletButton />
      </Container>
    </Header>
  );
}
