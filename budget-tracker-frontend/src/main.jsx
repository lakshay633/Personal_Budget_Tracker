import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; //Enables routing for the app
import { ThemeProvider } from "styled-components"; //Provides theme support for styled-components
import App from "./App"; //Main application component
import { GlobalStyles } from "./styles/GlobalStyles"; //Global CSS styles..
import { theme } from "./styles/theme"; //Custom theme for styled-components

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}> {/*Wrapper to provide theme to styled-components*/}
      <BrowserRouter> {/*Wrapper to enable navigation between pages*/}
        <GlobalStyles /> {/*Applies global styles*/}
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
