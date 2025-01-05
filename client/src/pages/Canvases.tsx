import { useState, useMemo, useCallback, useEffect } from "react";
import { Tab, SubTab, SubTabsWrapper, CardsContainer } from "./styles/CanvasesStyles";
import Modal from "../components/Modal";
import { config, apiEndpoint } from "../config";
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
    <main>
      <div>
        <div className="flex w-full gap-8">{Tabs}</div>
        <div>
          {isLoading ? (
            <Loader />
          ) : (
            <CardsContainer>
              {data.map((canvasData: ICanvas) => (
                <CanvasCard key={`${canvasData.canvasId}-${canvasData.name}`} {...canvasData} />
              ))}
            </CardsContainer>
          )}
        </div>
      </div>

      {/* Create New Canvas Button */}
      {address && (
        <div className="flex w-full justify-center">
          <button
            className="border-2 shadow-orange-400 rounded-md border-yellow-400 shadow-md color bg-yellow-400 px-6 py-2"
            onClick={toggleModal}
          >
            Create New Canvas
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && <Modal toggle={toggleModal} />}
    </main>
  );
};

export default Canvases;
