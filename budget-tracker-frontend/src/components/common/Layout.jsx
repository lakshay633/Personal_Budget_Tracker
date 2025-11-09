import React from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
import Footer from "./Footer";

//Layout component to structure the page with Navbar, main content, and Footer
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Main = styled.main`
  flex: 1; /* let main grow and fill remaining space between header & footer */
  display: flex;
  flex-direction: column;
`;

export default function Layout({ children }) {
  return (
    <Wrapper>
      {/*Navbar component*/}
      <Navbar />
      {/*Main content area*/}
      <Main>{children}</Main>
      {/*Footer component*/}
      <Footer />
    </Wrapper>
  );
}
