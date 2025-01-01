import styled from "styled-components";

export const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 26px;
  padding: 21px;
  overflow-y: scroll;
  height: 600px;
  border-radius: 8px;
  border: 1px solid lightgrey;
  justify-content: center;
  align-items: center;
`;

export const Card = styled.div`
  width: 100%;
  border: 1px solid lightgrey;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background: rgba(34, 34, 34, 0.6);
  max-width: 360px;
  backdrop-filter: blur(100px);
`;

export const NameIdEditWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const NameIdWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Name = styled.span`
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
`;
export const Id = styled.span`
  color: #ffffff;
  font-size: 12px;
`;

export const EnterBtn = styled.button`
  background: linear-gradient(
    90deg,
    rgba(29, 157, 155, 1) 0%,
    rgba(10, 103, 122, 1) 100%
  );
  border: 1px solid #306ab9;
  border-radius: 6px;
  box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px;
  box-sizing: border-box;
  color: #ffffff;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  font-weight: 800;
  outline: 0;
  padding: 10px 15px;
  text-align: center;
  text-rendering: geometricprecision;
  text-transform: none;
  user-select: none;
  width: 100%;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;

  &:hover,
  &:active {
    -webkit-transform: translateY(-1px);
    transform: translateY(-1px);
    background-color: initial;
    background: linear-gradient(
      90deg,
      rgba(37, 177, 175, 1) 0%,
      rgba(18, 122, 143, 1) 100%
    );
    background-position: 0 0;
    box-shadow: 2px 2px 5px #306ab9;
  }

  &:active {
    opacity: 0.5;
  }
`;

export const PropsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const PropWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PropTitle = styled.span`
  color: #ffffff;
  font-weight: 600;
`;
export const PropValue = styled.span`
  color: #ffffff;
`;
