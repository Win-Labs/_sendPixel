import styled from "styled-components";

export const FooterLinksContainer = styled.div`
  height: 50px;
  display: flex;
  gap: 30px;
  align-items: center;
`;

export const ConnectWalletBtnWrapper = styled.div``;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure it's above other content */
`;

export const ModalContainer = styled.div`
  background: rgba(255, 255, 255);
  border-radius: 10px;
  padding: 20px;
  width: 450px; /* Fixed width for a rectangular shape */
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  display: flex;
  flex-direction: column;
  align-items: center; /* Center content */
  gap: 10px; /* Space between elements */
  border: 1px solid rgba(255, 255, 255, 0.18);
`;
