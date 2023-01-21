import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
  createStyles,
} from "@mantine/core";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";

import { NavBar } from "./components/navbar/NavBar";
import { MainPage } from "./components/MainPage";
import { WalletProvider } from "./providers/WalletProvider";
import { Footer } from "./components/footer/Footer";

const useStyles = createStyles({
  app: {
    margin: "0 auto",
    padding: "0",
    textAlign: "center",
    minHeight: "100vh",
    height: "max-content",
    width: "95vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
});

function App() {
  const { classes } = useStyles();

  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: preferredColorScheme,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <WalletProvider>
          <div className={classes.app}>
            <NavBar />
            <MainPage />
            <Footer />
          </div>
        </WalletProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
