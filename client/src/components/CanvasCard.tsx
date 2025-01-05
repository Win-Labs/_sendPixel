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

const CanvasCard = ({ name, width, height, creationTime, nounImageId }) => {
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
        </NameIdWrapper>
      </NameIdEditWrapper>
      <PropWrapper>
        <PropTitle>Resolution</PropTitle>
        <PropValue>{resolution}</PropValue>
      </PropWrapper>
      <PropsWrapper>
        <button className="btn btn-warning">Enter</button>
      </PropsWrapper>
    </Card>
  );
};

export default CanvasCard;
