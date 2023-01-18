import { useState } from "react";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import { SorobanReactProvider } from "@soroban-react/core";

import "./App.css";
import { NavBar } from "./components/NavBar";
import { chainMetadataProps } from "./utils/chainMetadata";
import { MainPage } from "./components/MainPage";

function App() {
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
        <SorobanReactProvider {...chainMetadataProps}>
          <div className="App">
            <NavBar />
            <MainPage />
          </div>
        </SorobanReactProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
