import React from "react";
import { IPaintedPixel, IFetchedPixel } from "../pages/Canvas";

interface IPixel {
  pixelData: IFetchedPixel;
  brushColor: { r: number; g: number; b: number };
  handlePaintedPixels: (handler: (previousPixels: IPaintedPixel[]) => IPaintedPixel[]) => void;
}

const Pixel = React.memo(({ pixelData, brushColor, handlePaintedPixels }: IPixel) => {
  const handleClick = () => {
    handlePaintedPixels(paintedPixels => [...paintedPixels, { x: pixelData.x, y: pixelData.y, color: brushColor }]);
  };

  return (
    <div
      className={`relative w-full h-full cursor-pointer hover:border-2 border-black bg-[var(--bg-color)]`}
      style={
        {
          "--bg-color": `rgb(${brushColor.r}, ${brushColor.g}, ${brushColor.b})`,
        } as React.CSSProperties
      }
      onClick={() => handleClick()}
    ></div>
  );
});

export default Pixel;
