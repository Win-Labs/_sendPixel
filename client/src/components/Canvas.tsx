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
    // Step 1: Pad RGB values to 3 digits each
    let r_padded = String(r).padStart(3, "0");
    let g_padded = String(g).padStart(3, "0");
    let b_padded = String(b).padStart(3, "0");

    // Step 2: Pad x and y based on width and height
    const xDigits = Math.ceil(Math.log10(canvas.width)); // Number of digits needed for x
    const yDigits = Math.ceil(Math.log10(canvas.height));

    let x_padded = String(x).padStart(xDigits, "0");
    let y_padded = String(y).padStart(yDigits, "0");

    // Step 3: Concatenate RGB first, then x and y
    let result = `${r_padded}${g_padded}${b_padded}${x_padded}${y_padded}`;

    // Step 4: Ensure total length of 18 digits
    if (result.length < 18) {
      result = result.padStart(18, "0");
    }
    // const etherValue = parseFloat(result) / 1e18; // Divide by 1e18 to scale properly
    // console.log("parsedEther:", etherValue);
    console.log("this is result: ", BigInt(result));
    sendTransaction({
      to: canvas.canvasId as `0x${string}`,
      value: BigInt(result),
    });

    // if user is subscribed to chat, send notification
    if (isSubscribed) {
      notification(
        user,
        `Wallet ${user.account} colored canvas "${canvas.name}" to R${r} G${g} B${b} color at coordinates ${x}:${y}`
      );
    }
    return result;
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
