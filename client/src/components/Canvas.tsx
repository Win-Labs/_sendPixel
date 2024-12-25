import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { useSendTransaction } from "wagmi";
import { backendUrl, supportedChains } from "../config";
import { ICanvas } from "../models";
import Pixel from "./Pixel";
import {
  notification,
  usePushNotifications,
} from "../utils/usePushNotifications";
import { useQuery } from "@tanstack/react-query";
import { GET } from "../utils/api";

interface PixelsContainerProps {
  width: number;
  height: number;
}

const PixelsContainer = styled.div<PixelsContainerProps>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.width}, 1fr);
  grid-template-rows: repeat(${(props) => props.height}, 1fr);
  gap: 1px;
  aspect-ratio: 1;
  background-color: black;
  width: 500px;
  height: 500px;
  margin: 0 auto;
`;

export interface PixelItem {
  _id?: number;
  owner?: string | null;
  x: number;
  y: number;
  color: {
    r: number;
    g: number;
    b: number;
  };
}

const Canvas = () => {
  const { canvasId: paramCanvasId } = useParams();
  const navigate = useNavigate();
  const { user, isSubscribed } = usePushNotifications();
  const {
    data: hash,
    sendTransaction,
    isPending: isPixelTransactionPending,
  } = useSendTransaction();
  const {
    isPending: isPendingCanvas,
    error: errorCanvas,
    data: dataCanvas,
    refetch: refetchCanvas,
  } = useQuery({
    queryKey: ["pixels", paramCanvasId],
    queryFn: () => GET(`${backendUrl}/canvases/${paramCanvasId}`),
    enabled: !!paramCanvasId,
    refetchInterval: 3000,
  });

  const [canvas, setCanvas] = useState<ICanvas | null>(null);
  const [activePixelId, setActivePixelId] = useState<number | null>(null);
  const [pixels, setPixels] = useState<PixelItem[]>([]);
  const pixelsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (errorCanvas) {
      navigate("/");
    }
  }, [errorCanvas]);

  useEffect(() => {
    if (dataCanvas) {
      setCanvas(dataCanvas);
    }
  }, [dataCanvas]);

  // Update specific pixels when dataPixels is fetched
  useEffect(() => {
    if (canvas && canvas.width && canvas.height) {
      const grid = Array.from(
        { length: canvas.width * canvas.height },
        (_, index) => ({
          _id: index, // Use the index as the default _id
          owner: null, // Default owner is null (or you can set another default)
          x: index % canvas.width, // x position is the remainder when dividing index by width
          y: Math.floor(index / canvas.width), // y position is the integer division of index by width
          color: { r: 255, g: 255, b: 255 }, // Default color is white
        })
      );
      dataCanvas.pixels.forEach((pixel) => {
        grid[pixel.y * canvas.width + pixel.x] = pixel; // Update the correct pixel
      });
      setPixels(grid);
    }

    return () => {
      setPixels([]);
    };
  }, [canvas]);

  const handleClickOutside = (event) => {
    if (
      pixelsContainerRef.current &&
      !pixelsContainerRef.current.contains(event.target)
    ) {
      setActivePixelId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  async function padRgbXy(
    x: number,
    y: number,
    r: number,
    g: number,
    b: number
  ) {
    if (!canvas) return;

    // Step 1: Validate inputs
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      throw new Error("RGB values must be between 0 and 255.");
    }
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
      throw new Error("Coordinates are out of canvas bounds.");
    }

    // Step 2: Encode RGB and coordinates into a single 40-bit integer
    const packedValue =
      (BigInt(r) << 32n) |
      (BigInt(g) << 24n) |
      (BigInt(b) << 16n) |
      (BigInt(x) << 8n) |
      BigInt(y);

    console.log("Packed value:", packedValue.toString());

    // Step 3: Send the transaction with the packed value
    sendTransaction({
      to: canvas.canvasId as `0x${string}`,
      value: packedValue,
    });

    // Notify the user if subscribed
    if (isSubscribed) {
      notification(
        user,
        `Wallet ${user.account} colored canvas "${canvas.name}" to R${r} G${g} B${b} color at coordinates ${x}:${y}`
      );
    }

    return packedValue;
  }

  const onConstructEth = (
    x: number,
    y: number,
    r: number,
    g: number,
    b: number
  ) => {
    console.log("Constructing Ethereum transaction...");
    padRgbXy(x, y, r, g, b);
  };

  useEffect(() => {
    refetchCanvas();
  }, [hash]);

  const chain = supportedChains.find(
    (chain) => chain.id === dataCanvas?.chainId
  );
  const explorerUrl = chain?.blockExplorers?.custom?.url || "";
  const fullUrl = `${explorerUrl}address/${canvas?.canvasId}`;

  return (
    <main className="page-container">
      {isPendingCanvas ? (
        <div>Loading...</div>
      ) : (
        canvas && (
          <>
            <div className="canvas-header mb-4">
              <div className="canvas-header-left">
                <h1>{canvas.name}</h1>
                <div
                  style={{
                    display: "flex",
                    gap: "40px",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>Canvas creator:</span>
                  <span style={{ fontWeight: "bold" }}>{canvas.owner}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "40px",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Canvas resolution:</span>
                  <span style={{ fontWeight: "bold" }}>
                    {canvas.width}x{canvas.height}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "40px",
                    justifyContent: "space-between",
                  }}
                >
                  Funding recipient:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {canvas.destination}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "40px",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Deployed network:</span>
                  <span style={{ fontWeight: "bold" }}>
                    {
                      supportedChains.find(
                        (chain) => chain.id === canvas.chainId
                      )?.name
                    }
                  </span>
                </div>
                <a href={fullUrl} target="_blank" rel="noopener noreferrer">
                  Explore history on BlockScout
                </a>
              </div>
              <div className="canvas-header-right">
                <div>Recommended image:</div>
                <img
                  src={`https://noun.pics/${canvas.nounImageId}`}
                  style={{ width: "200px" }}
                />
              </div>
            </div>

            <PixelsContainer
              width={canvas.width}
              height={canvas.height}
              ref={pixelsContainerRef}
            >
              {pixels.map((pixel) => (
                <Pixel
                  key={pixel._id}
                  pixelData={pixel}
                  onConstructEth={onConstructEth}
                  activePixelId={activePixelId}
                  setActivePixelId={setActivePixelId}
                  isPixelTransactionPending={isPixelTransactionPending}
                />
              ))}
            </PixelsContainer>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <button className="btn btn-warning" onClick={() => navigate(-1)}>
                Back to Canvases
              </button>
            </div>
          </>
        )
      )}
    </main>
  );
};

export default Canvas;
