import { useNavigate } from "react-router";
import useExpirationTimer from "../hooks/useExpirationTimer";

const CanvasCard = ({ name, width, height, creationTime, nounImageId, canvasId }) => {
  const { isExpired, timeLeft } = useExpirationTimer(creationTime, 10); // 10 minutes expiration
  const resolution = `${width}x${height}`;
  const timeLeftString = `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`;
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/canvas/${canvasId}`);
  };

  return (
    <div className="border-4 rounded-md flex flex-col gap-3 border-yellow-400 p-4 shadow-md  shadow-orange-600 bg-black">
      <div>
        <img src={`https://noun.pics/${nounImageId}`} alt={name} />
      </div>
      <div className="flex flex-col items-center">
        <span className="text-white text-xs">{name}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-white text-xs">{resolution}</span>
      </div>

      <div className="flex w-full justify-center">
        <button
          className="border-2 shadow-orange-400 rounded-md border-yellow-400 shadow-md bg-yellow-400 px-6 py-2 text-xs"
          onClick={handleNavigate}
        >
          Enter
        </button>
      </div>
    </div>
  );
};

export default CanvasCard;
