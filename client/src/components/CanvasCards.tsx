import { useEffect, useState } from "react";
import * as s from "./styles/CanvasCardsStyles";
import { backendUrl } from "../config";
import Loader from "./Loader";
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
      if (filterMode === FilterMode.ALL) {
        return canvas;
      } else if (filterMode === FilterMode.OWNED) {
        return canvas.owner === address;
      } else if (filterMode === FilterMode.JOINED) {
        return canvas.pixels.some((pixel) => pixel.owner === address);
      } else if (filterMode === FilterMode.LISTED) {
        return canvas.isListed;
      } else {
        return canvas.isSold;
      }
    })
    .filter((canvas) => {
      return canvas.chainId === selectedChainId;
    });

  return (
    <div className="cards-container">
      {isLoadingCanvases ? (
        <Loader />
      ) : !canvases?.length ? (
        <div style={{ color: "white" }}>No canvases created yet</div>
      ) : (
        displayedCanvases.map((canvasData) => (
          <CanvasCard
            {...canvasData}
            key={`${canvasData.canvasId}-${canvasData.name}-${canvasData.owner}-${canvasData.width}-${canvasData.height}`}
          />
        ))
      )}
    </div>
  );
};

export default CanvasCards;
