import React from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* IMPORTANT: full viewport height */
  background-color: ${({ theme }) => theme.colors.background};
`;

const Main = styled.main`
  flex: 1; /* let main grow and fill remaining space between header/footer */
  display: flex;
  flex-direction: column;
`;

export default function Layout({ children }) {
  return (
    <Wrapper>
      <Navbar />
      <Main>{children}</Main>
      <Footer />
    </Wrapper>
  );
}
