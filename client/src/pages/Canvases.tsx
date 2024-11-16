import { useState } from "react";
import * as s from "./CanvasesStyles";
import Modal from "../components/Modal";
import { supportedChains } from "../config";
import { useOutletContext } from "react-router-dom";
import CanvasCards from "../components/CanvasCards";

export enum FilterMode {
  ALL = "ALL",
  OWNED = "OWNED",
  JOINED = "JOINED",
  FUNDED = "FUNDED",
}

const Canvases = () => {
  const { address } = useOutletContext<{ address: string | undefined }>();
  const [filterMode, setFilterMode] = useState(FilterMode.ALL);
  const [selectedChainId, setSelectedChainId] = useState<number>(
    supportedChains[0].id
  );

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <main className="page-container">
      <div className="tabs-wrapper mb-3">
        <s.Tab
          onClick={() => setFilterMode(FilterMode.ALL)}
          $active={filterMode === FilterMode.ALL}
        >
          All
        </s.Tab>
        <s.Tab
          onClick={() => setFilterMode(FilterMode.OWNED)}
          $active={filterMode === FilterMode.OWNED}
        >
          Owned
        </s.Tab>
        <s.Tab
          onClick={() => setFilterMode(FilterMode.JOINED)}
          $active={filterMode === FilterMode.JOINED}
        >
          Joined
        </s.Tab>
        <s.Tab
          onClick={() => setFilterMode(FilterMode.FUNDED)}
          $active={filterMode === FilterMode.FUNDED}
        >
          Funded
        </s.Tab>
      </div>
      <s.SubTabsWrapper>
        {supportedChains.map((chain) => (
          <s.SubTab
            key={chain.id}
            onClick={() => setSelectedChainId(chain.id)}
            $active={selectedChainId === chain.id}
          >
            {chain.name}
          </s.SubTab>
        ))}
      </s.SubTabsWrapper>
      <CanvasCards filterMode={filterMode} selectedChainId={selectedChainId} />
      <div
        style={{ display: "flex", width: "100%", justifyContent: "center" }}
        className="mt-4"
      >
        {address && (
          <button className="btn btn-warning" onClick={toggleModal}>
            Create New Canvas
          </button>
        )}
      </div>

      {showModal && <Modal toggle={toggleModal} />}
    </main>
  );
};

export default Canvases;
