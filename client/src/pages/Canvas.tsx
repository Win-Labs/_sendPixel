import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { useSendTransaction } from "wagmi";
import { apiEndpoint } from "../config";
import { ICanvas } from "../models";
import Pixel from "../components/Pixel";

import { useQuery } from "@tanstack/react-query";
import { GET } from "../utils/api";
import Loader from "../components/Loader";
import TargetImage from "../components/TargetImage";
import CanvasDetails from "../components/CanvasDetails";
import CanvasPixels from "../components/CanvasPixels";
import ColorPicker from "../components/ColorPicker";
import Solidifier from "../components/Solidifier";

export interface IFetchedPixel {
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

export interface IPaintedPixel {
  x: number;
  y: number;
  color: { r: number; g: number; b: number };
}

// export interface ICanvas {
//   _id: string;
//   name: string;
//   width: number;
//   height: number;
//   owner: string;
//   nounImageId: string;
//   pixels: IFetchedPixel[];
// }

const Canvas = () => {
  const { canvasId } = useParams();
  const [brushColor, setBrushColor] = useState({ r: 255, g: 255, b: 255 });
  const [paintedPixels, setPaintedPixels] = useState<IPaintedPixel[]>([]);

  const handleBrushColor = (color: { r: number; g: number; b: number }) => {
    setBrushColor(color);
  };

  const handlePaintedPixels = (handler: (previousPixels: IPaintedPixel[]) => IPaintedPixel[]): void => {
    setPaintedPixels(previousPixels => handler(previousPixels));
  };

  const { isPending: isPendingCanvas, data: fetchedCanvas } = useQuery({
    queryKey: ["pixels", canvasId],
    queryFn: () => GET(`${apiEndpoint}/canvases/${canvasId}`),
    enabled: !!canvasId,
    refetchInterval: 3000,
  });

  const [pixels, setPixels] = useState<IFetchedPixel[]>([]);

  useEffect(() => {
    if (fetchedCanvas && fetchedCanvas.width > 0 && fetchedCanvas.height > 0) {
      // Initialize grid with default values
      const grid = new Array(fetchedCanvas.width * fetchedCanvas.height).fill(null).map((_, index) => ({
        _id: index,
        owner: null,
        x: index % fetchedCanvas.width,
        y: Math.floor(index / fetchedCanvas.width),
        color: { r: 255, g: 255, b: 255 },
      }));

      // Overwrite grid pixels with fetchedCanvas pixels
      fetchedCanvas.pixels.forEach(pixel => {
        grid[pixel.y * fetchedCanvas.width + pixel.x] = pixel;
      });

      setPixels(grid);
    }
    return () => {
      setPixels([]);
    };
  }, [fetchedCanvas, fetchedCanvas]);

  return (
    <main className="p-2.5 flex flex-col justify-between">
      {isPendingCanvas ? (
        <Loader />
      ) : (
        fetchedCanvas && (
          <>
            <div className="flex flex-col items-center mb-6 justify-center gap-8">
              <div className="flex flex-row gap-4 items-end">
                <CanvasDetails
                  name={fetchedCanvas.name}
                  width={fetchedCanvas.width}
                  height={fetchedCanvas.height}
                  owner={fetchedCanvas.owner}
                />
              </div>
              <div className="flex flex-row gap-4">
                <div className="flex flex-col gap-4 ">
                  <CanvasPixels
                    handlePaintedPixels={handlePaintedPixels}
                    pixels={pixels}
                    brushColor={brushColor}
                    canvasProps={{ width: fetchedCanvas.width, height: fetchedCanvas.height }}
                  />
                  <Solidifier canvasId={canvasId as string} pixels={paintedPixels} />
                </div>
                <div className="flex flex-col gap-4 items-start">
                  <TargetImage nounImageId={fetchedCanvas.nounImageId} />
                  <ColorPicker brushColor={brushColor} handleBrushColor={handleBrushColor} />
                </div>
              </div>
            </div>
          </>
        )
      )}
    </main>
  );
};

export default Canvas;
