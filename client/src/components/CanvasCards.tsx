import { useEffect, useState } from "react";
import * as s from "./CanvasCardsStyles";
import { backendUrl } from "../config";
import { CircularLoader } from "./Loader";
import { FilterMode } from "../pages/Canvases";
import { useAccount } from "wagmi";
import { ICanvas } from "../models";
import CanvasCard from "./CanvasCard";
import { GET } from "../utils/api";
import { useQuery } from "@tanstack/react-query";

interface IProps {
  filterMode: FilterMode;
  selectedChainId: number;
}

const CanvasCards: React.FC<IProps> = ({ filterMode, selectedChainId }) => {
  const [canvases, setCanvases] = useState<ICanvas[]>([]);
  const { address } = useAccount();

  const { isLoading: isLoadingCanvases, data: dataCanvases } = useQuery({
    queryKey: ["canvases"],
    queryFn: () => GET(`${backendUrl}/canvases`),
    enabled: true,
    refetchInterval: 3000,
  });

  useEffect(() => {
    if (dataCanvases) {
      setCanvases(dataCanvases);
    }
  }, [dataCanvases]);

  const displayedCanvases = canvases
    .filter((canvas) => {
      if (filterMode === FilterMode.OWNED) {
        return canvas.owner === address;
      } else if (filterMode === FilterMode.JOINED) {
        return canvas.pixels.some((pixel) => pixel.owner === address);
      } else if (filterMode === FilterMode.FUNDED) {
        return canvas.isFunded;
      } else {
        return canvas;
      }
    })
    .filter((canvas) => {
      return canvas.chainId === selectedChainId;
    });

  return (
    <div className="cards-container">
      {isLoadingCanvases ? (
        <CircularLoader />
      ) : !canvases?.length ? (
        <div style={{ color: "white" }}>No canvases created yet</div>
      ) : (
        displayedCanvases.map(
          ({
            canvasId,
            name,
            owner,
            width,
            height,
            worldIdVerified,
            destination,
            chainId,
            creationTime,
            isFunded,
            nounImageId,
          }) => (
            <CanvasCard
              key={`${canvasId}-${name}-${owner}-${width}-${height}`}
              canvasId={canvasId}
              name={name}
              owner={owner}
              width={width}
              height={height}
              worldIdVerified={worldIdVerified}
              destination={destination}
              chainId={chainId}
              creationTime={creationTime}
              isFunded={isFunded}
              nounImageId={nounImageId}
            />
          )
        )
      )}
    </div>
  );
};

export default CanvasCards;
