import { useState, useEffect } from "react";
import { add, differenceInSeconds } from "date-fns";

const useExpirationTimer = (
  creationTime: number,
  expirationMinutes: number
) => {
  const [isExpired, setIsExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const expirationDate = add(new Date(creationTime * 1000), {
      minutes: expirationMinutes,
    });

    const updateTimer = () => {
      const secondsLeft = differenceInSeconds(expirationDate, new Date());
      if (secondsLeft <= 0) {
        setIsExpired(true);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor(secondsLeft / 3600);
        const minutes = Math.floor((secondsLeft % 3600) / 60);
        const seconds = secondsLeft % 60;

        setTimeLeft({ hours, minutes, seconds });
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval);
  }, [creationTime, expirationMinutes]);

  return { isExpired, timeLeft };
};

export default useExpirationTimer;
