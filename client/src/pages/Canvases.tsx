import { useState, useMemo, useCallback, useEffect } from "react";
import Modal from "../components/Modal";
import { apiEndpoint } from "../config";
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
  const [filterTab, setFilterTab] = useState(FilterTab.ARENA);

  const [showModal, setShowModal] = useState(false);

  const toggleModal = useCallback(() => {
    setShowModal(prev => !prev);
  }, []);

  // Memoized tabs
  const Tabs = useMemo(() => {
    return Object.values(FilterTab).map(tab => (
      <div
        className={filterTab === tab ? `text-2xl text-yellow-400 cursor-pointer` : `text-2xl text-white cursor-pointer`}
        key={tab}
        onClick={() => setFilterTab(tab)}
      >
        {tab[0] + tab.slice(1).toLowerCase()}
      </div>
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
    <main className="flex flex-col h-full">
      <div className="flex w-full gap-8">{Tabs}</div>
      <div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="flex w-full gap-3 pt-8 items-center mb-8">
            {data.map((canvasData: ICanvas) => (
              <CanvasCard key={`${canvasData.canvasId}-${canvasData.name}`} {...canvasData} />
            ))}
          </div>
        )}
      </div>

      {address && (
        <div className="flex w-full justify-center mt-auto">
          <button
            className="border-2 shadow-orange-400 rounded-md border-yellow-400 shadow-md color bg-yellow-400 px-6 py-2"
            onClick={toggleModal}
          >
            Create New Canvas
          </button>
        </div>
      )}

      {showModal && <Modal toggle={toggleModal} />}
    </main>
  );
};

export default Canvases;
