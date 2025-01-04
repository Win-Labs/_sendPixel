import {
  Card,
  NameIdEditWrapper,
  NameIdWrapper,
  Name,
  Id,
  PropWrapper,
  PropTitle,
  PropValue,
  PropsWrapper,
} from "./styles/CanvasCardsStyles";
import useExpirationTimer from "../hooks/useExpirationTimer";

const CanvasCard = ({ canvasId, name, owner, width, height, creationTime, nounImageId }) => {
  const { isExpired, timeLeft } = useExpirationTimer(creationTime, 10); // 10 minutes expiration
  const resolution = `${width}x${height}`;
  const timeLeftString = `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`;

  return (
    <Card>
      <div>
        <img src={`https://noun.pics/${nounImageId}`} alt={name} />
      </div>
      <NameIdEditWrapper>
        <NameIdWrapper>
          <Name>{name}</Name>
          <Id>{canvasId}</Id>
        </NameIdWrapper>
      </NameIdEditWrapper>
      <PropWrapper>
        <PropTitle>Deployer</PropTitle>
        <Id>{owner}</Id>
      </PropWrapper>
      <PropWrapper>
        <PropTitle>Resolution</PropTitle>
        <PropValue>{resolution}</PropValue>
      </PropWrapper>
      <PropsWrapper>
        {isExpired ? (
          <PropWrapper>
            <PropTitle>Expired</PropTitle>
          </PropWrapper>
        ) : (
          <PropWrapper>
            <PropTitle>Expires in:</PropTitle>
            <PropValue>{timeLeftString}</PropValue>
          </PropWrapper>
        )}
      </PropsWrapper>
    </Card>
  );
};

export default CanvasCard;
