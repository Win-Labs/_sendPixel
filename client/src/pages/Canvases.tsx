import { useState, useMemo, useCallback, useEffect } from "react";
import { Tab, SubTab, SubTabsWrapper } from "./styles/CanvasesStyles";
import Modal from "../components/Modal";
import { config, backendUrl } from "../config";
import { useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import CanvasCard from "../components/CanvasCard";
import Loader from "../components/Loader";

export enum FilterMode {
  ALL = "ALL",
  OWNED = "OWNED",
  JOINED = "JOINED",
  LISTED = "LISTED",
  SOLD = "SOLD",
}
const Canvases = () => {
  const { address } = useOutletContext<{ address: string | undefined }>();
  const { address: accountAddress } = useAccount();

  const [filterMode, setFilterMode] = useState(FilterMode.ALL);
  const [selectedChainId, setSelectedChainId] = useState<number>(
    config.chains[0].id
  );
  const [showModal, setShowModal] = useState(false);
  const [canvases, setCanvases] = useState([]);

  const toggleModal = useCallback(() => {
    setShowModal((prev) => !prev);
  }, []);

  const tabs = useMemo(
    () =>
      Object.values(FilterMode).map((mode) => (
        <Tab
          key={mode}
          onClick={() => setFilterMode(mode)}
          $active={filterMode === mode}
        >
          {mode[0] + mode.slice(1).toLowerCase()}
        </Tab>
      )),
    [filterMode]
  );

  const subTabs = useMemo(
    () =>
      config.chains.map((chain) => (
        <SubTab
          key={chain.id}
          onClick={() => setSelectedChainId(chain.id)}
          $active={selectedChainId === chain.id}
        >
          {chain.name}
        </SubTab>
      )),
    [selectedChainId]
  );

  const { isLoading: isLoadingCanvases, data: dataCanvases } = useQuery({
    queryKey: ["canvases"],
    queryFn: () => fetch(`${backendUrl}/canvases`).then((res) => res.json()),
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
        return canvas.owner === accountAddress;
      } else if (filterMode === FilterMode.JOINED) {
        return canvas.pixels.some((pixel) => pixel.owner === accountAddress);
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
    <main className="page-container">
      <div>
        <div className="tabs-wrapper mb-3">{tabs}</div>
        <SubTabsWrapper>{subTabs}</SubTabsWrapper>
        <div className="canvas-cards-container">
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
      </div>

      {address && (
        <div className="create-canvas-button-container mt-4">
          <button className="btn btn-warning" onClick={toggleModal}>
            Create New Canvas
          </button>
        </div>
      )}

      {showModal && <Modal toggle={toggleModal} />}
    </main>
  );
};

export default Canvases;
