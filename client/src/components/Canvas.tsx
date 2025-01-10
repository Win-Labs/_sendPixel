import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { useSendTransaction } from "wagmi";
import { apiEndpoint } from "../config";
import { ICanvas } from "../models";
import Pixel from "./Pixel";

import { useQuery } from "@tanstack/react-query";
import { GET } from "../utils/api";
import Loader from "./Loader";
import { formatAddress } from "../utils";

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
  const { canvasId } = useParams();
  const navigate = useNavigate();
  const { data, sendTransaction, isPending } = useSendTransaction();
  const {
    isPending: isPendingCanvas,
    error: errorCanvas,
    data: dataCanvas,
    refetch: refetchCanvas,
  } = useQuery({
    queryKey: ["pixels", canvasId],
    queryFn: () => GET(`${apiEndpoint}/canvases/${canvasId}`),
    enabled: !!canvasId,
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

  useEffect(() => {
    if (canvas && canvas.width > 0 && canvas.height > 0) {
      // Initialize grid with default values
      const grid = new Array(canvas.width * canvas.height).fill(null).map((_, index) => ({
        _id: index,
        owner: null,
        x: index % canvas.width,
        y: Math.floor(index / canvas.width), // Correct y calculation
        color: { r: 255, g: 255, b: 255 },
      }));

      // Overwrite grid pixels with dataCanvas pixels
      dataCanvas.pixels.forEach(pixel => {
        grid[pixel.y * canvas.width + pixel.x] = pixel;
      });

      // Update state
      setPixels(grid);
    }
    return () => {
      setPixels([]);
    };
  }, [canvas, dataCanvas]);

  const handleClickOutside = event => {
    if (pixelsContainerRef.current && !pixelsContainerRef.current.contains(event.target)) {
      setActivePixelId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  async function encodeToNativeCoin(x: number, y: number, r: number, g: number, b: number) {
    if (!canvas) return;

    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      throw new Error("RGB values must be between 0 and 255.");
    }
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
      throw new Error("Coordinates are out of canvas bounds.");
    }

    const packedValue = (BigInt(r) << 32n) | (BigInt(g) << 24n) | (BigInt(b) << 16n) | (BigInt(x) << 8n) | BigInt(y);

    console.log("Packed value:", packedValue.toString());

    sendTransaction({
      to: canvas.canvasId as `0x${string}`,
      value: packedValue,
    });

    return packedValue;
  }

  useEffect(() => {
    refetchCanvas();
  }, [data]);

  return (
    <main className="p-2.5 w-full flex flex-1 flex-col justify-between">
      {isPendingCanvas ? (
        <Loader />
      ) : (
        canvas && (
          <>
            <div className="flex flex-row items-start mb-6 justify-center gap-8">
              <div className="flex flex-col gap-4 items-end">
                <div className="flex flex-col bg-black text-yellow-500 border-4 border-yellow-500 p-10 rounded-md w-[800px]">
                  <div className="flex justify-between gap-10">
                    <span>NAME:</span>
                    <span className="font-bold">{canvas.name}</span>
                  </div>
                  <div className="flex justify-between gap-10">
                    <span>CREATOR:</span>
                    <span className="font-bold">{formatAddress(canvas.owner)}</span>
                  </div>
                  <div className="flex justify-between gap-10">
                    <span>RESOLUTION:</span>
                    <span className="font-bold">
                      {canvas.width}x{canvas.height}
                    </span>
                  </div>
                </div>
                <div
                  className="grid bg-black my-0 w-[500px] grid-cols-[repeat(var(--canvas-columns),1fr)] grid-rows-[repeat(var(--canvas-rows),1fr)] h-[calc(var(--canvas-height))] border-yellow-500 border-4 bg-black"
                  style={
                    canvas &&
                    ({
                      "--canvas-columns": canvas.width,
                      "--canvas-rows": canvas.height,
                      "--canvas-height": `calc(500px * ${canvas.height / canvas.width})`,
                    } as React.CSSProperties)
                  }
                >
                  {pixels.map(pixel => (
                    <Pixel
                      key={pixel._id}
                      pixelData={pixel}
                      onConstruct={encodeToNativeCoin}
                      activePixelId={activePixelId}
                      setActivePixelId={setActivePixelId}
                      isPixelTransactionPending={isPending}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 pb-4 pt-4  bg-black text-yellow-500 border-4 border-yellow-500">
                <span>Recommended Image</span>
                <img src={`https://noun.pics/${canvas.nounImageId}`} />
              </div>
            </div>

            <div className="flex justify-center mt-5">
              <button onClick={() => navigate(-1)}>Back to Canvases</button>
            </div>
          </>
        )
      )}
    </main>
  );
};

export default Canvas;
