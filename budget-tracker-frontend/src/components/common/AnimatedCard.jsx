import styled from "styled-components";

const AnimatedCard = styled.div`
  width: 400px;
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(2,6,23,0.12);
  transform-origin: center;
  animation: authCardIn 520ms cubic-bezier(.22,.9,.35,1);

  @keyframes authCardIn {
    0% {
      opacity: 0;
      transform: translateY(18px) scale(0.992);
    }
    60% {
      opacity: 1;
      transform: translateY(-6px) scale(1.006);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transform: none;
  }
`;

export default AnimatedCard;
