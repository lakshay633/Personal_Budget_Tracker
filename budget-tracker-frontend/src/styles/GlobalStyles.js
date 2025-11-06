import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  html, body, #root {
    height: 100%;
  }

  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  a { color: inherit; text-decoration: none; }
  button { font-family: inherit; }
`;
