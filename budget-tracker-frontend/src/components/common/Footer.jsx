import React from "react";
import styled from "styled-components";

const FooterWrap = styled.footer`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  text-align: center;
  padding: 10px;
  font-size: 14px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
`;

export default function Footer() {
  return (
    <FooterWrap>
      &copy; {new Date().getFullYear()} Budget Tracker | All rights reserved.
    </FooterWrap>
  );
}
