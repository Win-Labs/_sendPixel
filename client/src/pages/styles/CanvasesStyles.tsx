import styled from "styled-components";

export const CardsContainer = styled.div`
  display: flex;
  gap: 24px;
  padding: 24px;
  align-items: center;

  margin-bottom: 63px;
`;

export const Card = styled.div`
  max-width: 400px;
  border-radius: 8px;
  border: 1px solid #1e1e1e;
  padding: 10px;
  height: 500px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const CardTitle = styled.p`
  font-style: normal;
  line-height: 140%; /* 22.4px */
  margin-bottom: 8px;
`;

export const CardNumericValue = styled.p`
  color: #1e1e1e;
  font-style: normal;
  line-height: 120%;
  letter-spacing: -0.48px;
  margin-bottom: 44px;
`;
export const CardBtn = styled.button`
  display: flex;
  padding: 10px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background: lightgrey;
  margin-top: auto;
  align-self: flex-start;
`;

export const TabsWrapper = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
  margin-bottom: 25px;
`;

export const SubTabsWrapper = styled(TabsWrapper)`
  gap: 16px;
  margin-bottom: 10px;
`;

interface TabProps {
  $active: boolean;
}

export const Tab = styled.div<TabProps>`
  color: ${(props) => (props.$active ? "#ffc107" : "white")};
  font-size: 30px;
  font-weight: 500;
  cursor: pointer;
`;

export const SubTab = styled(Tab)`
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.02em;
  text-align: left;
  margin-bottom: 10px;
`;

export const ConnectWalletBtn = styled(CardBtn)`
  margin-left: auto;
`;

export const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 30px;
  margin-bottom: 31px;
`;

export const Filter = styled.input`
  type: checkbox;
  checked: false;
`;
