import { useState, useMemo, useCallback, useEffect } from "react";
import { Tab, SubTab, SubTabsWrapper } from "./styles/CanvasesStyles";
import Modal from "../components/Modal";
import { config, apiEndpoint } from "../config";
import { useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import CanvasCard from "../components/CanvasCard";
import { ICanvas } from "../models";

import Loader from "../components/Loader";
import { GET } from "../utils/api";

export enum FilterTab {
  ALL = "ALL",
  OWNED = "OWNED",
  JOINED = "JOINED",
  LISTED = "LISTED",
  SOLD = "SOLD",
}
const Canvases = () => {
  const { address } = useAccount();

  const [filterTab, setFilterTab] = useState(FilterTab.ALL);
  const [selectedChainId, setSelectedChainId] = useState<number>(
    config.chains[0].id
  );
  const [showModal, setShowModal] = useState(false);
  const [canvases, setCanvases] = useState<ICanvas[]>([]);

  const toggleModal = useCallback(() => {
    setShowModal((prev) => !prev);
  }, []);

  const tabs = useMemo(
    () =>
      Object.values(FilterTab).map((mode) => (
        <Tab
          key={mode}
          onClick={() => setFilterTab(mode)}
          $active={filterTab === mode}
        >
          {mode[0] + mode.slice(1).toLowerCase()}
        </Tab>
      )),
    [filterTab]
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

  const [key, setKey] = useState(["canvases"]);
  const [url, setUrl] = useState(`${apiEndpoint}/canvases`);

  const { isPending, error, data, refetch, isFetching } = useQuery({
    queryKey: key,
    queryFn: () => GET(url),
    enabled: true,
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (!address) return;

    if (filterTab === FilterTab.ALL) {
      setKey(["canvases"]);
      setUrl(`${apiEndpoint}/canvases`);
    } else if (filterTab === FilterTab.OWNED) {
      setKey(["canvasesJoined", address]);
      setUrl(`${apiEndpoint}/addresses/${address}/canvases/joined`);
    } else if (filterTab === FilterTab.JOINED) {
      setKey(["canvasesGenerated", address]);
      setUrl(`${apiEndpoint}/addresses/${address}/canvases/generated`);
    }
  }, [filterTab, address]);

  return (
    <main className="page-container">
      <div>
        <div className="tabs-wrapper mb-3">{tabs}</div>
        <SubTabsWrapper>{subTabs}</SubTabsWrapper>
        <div className="canvas-cards-container">
          {isPending ? (
            <Loader />
          ) : !canvases?.length ? (
            <div style={{ color: "white" }}>No canvases created yet</div>
          ) : (
            data.map((canvasData) => (
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
