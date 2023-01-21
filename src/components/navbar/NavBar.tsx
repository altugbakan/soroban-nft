import { createStyles, Header, Container, Group } from "@mantine/core";
import { APP_NAME, HEADER_HEIGHT } from "../../utils/constants";
import { ConnectionMenu } from "./ConnectionMenu";

const useStyles = createStyles((theme) => ({
  inner: {
    height: HEADER_HEIGHT,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    width: "48px",
    height: "48px",
  },
  link: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    textDecoration: "none",
    "&:visited": {
      textDecoration: "none",
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },
}));

export function NavBar() {
  const { classes } = useStyles();

  return (
    <Header height={HEADER_HEIGHT} sx={{ borderBottom: 0 }} mb={120}>
      <Container className={classes.inner} fluid>
        <a href="/" className={classes.link}>
          <Group>
            <img
              className={classes.image}
              src="/images/logo.png"
              alt={`${APP_NAME} Logo`}
            />
            <h3>{APP_NAME}</h3>
          </Group>
        </a>
        <ConnectionMenu />
      </Container>
    </Header>
  );
}
