import styled from "styled-components";

interface PixelsContainerProps {
  width: number;
  height: number;
}

const PageContainer = styled.main`
  padding: 20px;

  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CanvasHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const CanvasHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
`;

const CanvasHeaderRight = styled.div`
  color: white;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 40px;
`;

const BlockScoutLink = styled.a`
  color: #007bff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const CenteredButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PixelsContainer = styled.div<PixelsContainerProps>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.width}, 1fr);
  grid-template-rows: repeat(${(props) => props.height}, 1fr);
  aspect-ratio: 1;
  background-color: black;
  width: 500px;
  height: 500px;
  margin: 0 auto;
`;

const BoldText = styled.span`
  font-weight: bold;
`;

export {
  PageContainer,
  CanvasHeader,
  CanvasHeaderLeft,
  CanvasHeaderRight,
  InfoRow,
  BlockScoutLink,
  CenteredButtonContainer,
  PixelsContainer,
  BoldText,
};
