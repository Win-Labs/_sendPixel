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
  ARENA = "ARENA",
  MARKETPLACE = "MARKETPLACE",
}

const Canvases = () => {
  const { address } = useAccount();
  const [filterTab, setFilterTab] = useState("All");

  const [showModal, setShowModal] = useState(false);

  const toggleModal = useCallback(() => {
    setShowModal(prev => !prev);
  }, []);

  // Memoized tabs
  const Tabs = useMemo(() => {
    return Object.values(FilterTab).map(tab => (
      <Tab key={tab} onClick={() => setFilterTab(tab)} $active={filterTab === tab}>
        {tab[0] + tab.slice(1).toLowerCase()}
      </Tab>
    ));
  }, [filterTab]);

  // Fetch data using react-query
  const { isLoading, error, data } = useQuery({
    queryKey: ["canvases", filterTab, address],
    queryFn: () => GET(`${apiEndpoint}/canvases`),
    enabled: true,
    refetchInterval: 1000,
  });

  return (
    <main className="page-container">
      <div>
        <div className="tabs-wrapper mb-3">{Tabs}</div>

        <div className="canvas-cards-container">
          {isLoading ? (
            <Loader />
          ) : error ? (
            <div style={{ color: "red" }}>Failed to load canvases. Please try again.</div>
          ) : data?.length ? (
            data.map((canvasData: ICanvas) => (
              <CanvasCard key={`${canvasData.canvasId}-${canvasData.name}`} {...canvasData} />
            ))
          ) : (
            <div style={{ color: "white" }}>No canvases available.</div>
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
