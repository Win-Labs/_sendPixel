import * as s from "./styles/CanvasCardsStyles";
import useExpirationTimer from "../hooks/useExpirationTimer";

const CanvasCard = ({ canvasId, name, owner, width, height, creationTime, nounImageId }) => {
  const { isExpired, timeLeft } = useExpirationTimer(creationTime, 10); // 10 minutes expiration

  return (
    <s.Card>
      <div>
        <img src={`https://noun.pics/${nounImageId}`} alt={name} />
      </div>
      <s.NameIdEditWrapper>
        <s.NameIdWrapper>
          <s.Name>{name}</s.Name>
          <s.Id>{canvasId}</s.Id>
        </s.NameIdWrapper>
      </s.NameIdEditWrapper>
      <s.PropWrapper>
        <s.PropTitle>Deployer</s.PropTitle>
        <s.Id>{owner}</s.Id>
      </s.PropWrapper>
      <s.PropWrapper>
        <s.PropTitle>Resolution</s.PropTitle>
        <s.PropValue>
          {width}x{height}
        </s.PropValue>
      </s.PropWrapper>
      <s.PropsWrapper>
        {isExpired ? (
          <s.PropWrapper>
            <s.PropTitle>Expired</s.PropTitle>
          </s.PropWrapper>
        ) : (
          <s.PropWrapper>
            <s.PropTitle>Expires in:</s.PropTitle>
            <s.PropValue>
              {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </s.PropValue>
          </s.PropWrapper>
        )}
      </s.PropsWrapper>
    </s.Card>
  );
};

export default CanvasCard;
