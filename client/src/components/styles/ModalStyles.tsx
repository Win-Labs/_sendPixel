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

const Title = styled.h2`
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const SelectBox = styled.select`
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
`;

const Label = styled.p``;

const SubmitBtnContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
`;

export {
  Overlay,
  ModalContainer,
  Title,
  InputContainer,
  SelectBox,
  Label,
  SubmitBtnContainer,
  Input,
};
