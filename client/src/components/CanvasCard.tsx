import { useNavigate } from "react-router-dom";
import * as s from "./styles/CanvasCardsStyles";
import { useAccount, useWriteContract } from "wagmi";
import { enqueueSnackbar } from "notistack";
import { switchChain } from "@wagmi/core";
import { config } from "../config";
import { CANVAS_ABI } from "../constants/abis";
import { useEffect, useState } from "react";
import { add, differenceInSeconds } from "date-fns";

const CanvasCard = ({
  canvasId,
  name,
  owner,
  width,
  height,
  destination,
  chainId: canvasChainId,
  creationTime,
  isFunded,
  nounImageId,
}) => {
  const navigate = useNavigate();
  const { address, chainId: accountChainId } = useAccount();
  const {
    data: claimTokenData,
    isPending: isClaimTokenLoading,
    writeContractAsync,
  } = useWriteContract();

  const [gradient, setGradient] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const isOwner = address === owner;
  const isBeneficiary = address === destination;
  const isPlayable = !isFunded;

  // Handle canvas initialization (Step 1)
  const handleClaimTokens = () => {
    if (accountChainId === canvasChainId) {
      claim();
    } else {
      switchChain(config, { chainId: canvasChainId })
        .then((data) => {
          console.log("Switched chain: ", data);
        })
        .then(() => {
          claim();
        });
    }
  };

  const handleNavigate = () => {
    navigate(`/canvas/${canvasId}`);
  };

  const claim = () => {
    writeContractAsync({
      abi: CANVAS_ABI,
      address: canvasId,
      functionName: "transferFunds",
      args: [],
      account: address,
    }).then(() => {
      enqueueSnackbar("Tokens has been claimed", {
        variant: "success",
      });
    });
  };

  useEffect(() => {
    const expirationDate = add(new Date(creationTime * 1000), { minutes: 10 });

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
  }, [creationTime]);

  return (
    <s.Card>
      <div>
        <img src={`https://noun.pics/${nounImageId}`} />
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

      {isBeneficiary && (
        <button
          className="btn btn-warning"
          onClick={handleClaimTokens}
          disabled={!isExpired}
        >
          Claim tokens
        </button>
      )}
      {isPlayable && (
        <button className="btn btn-warning" onClick={handleNavigate}>
          Enter
        </button>
      )}
    </s.Card>
  );
};

export default CanvasCard;
