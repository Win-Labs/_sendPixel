import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  width: 100%;
  z-index: 2;
  max-width: 500px;
  border-radius: 10px;
  gap: 10px;
  padding: 30px;
  background-color: #fff;
  position: absolute;
`;

export { Overlay, ModalContainer };
