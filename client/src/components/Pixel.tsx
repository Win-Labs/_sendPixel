import React, { useState } from "react";
import { IPaintedPixel, IFetchedPixel } from "../pages/Canvas";

interface IPixel {
  pixelData: IFetchedPixel;
  brushColor: { r: number; g: number; b: number };
  handlePaintedPixels: (handler: (previousPixels: IPaintedPixel[]) => IPaintedPixel[]) => void;
}

const Pixel = React.memo(({ pixelData, brushColor, handlePaintedPixels }: IPixel) => {
  const [color, setColor] = useState(pixelData.color);
  const handleClick = () => {
    setColor(brushColor);
    console.log(`Painted pixel at x: ${pixelData.x}, y: ${pixelData.y} with color: ${JSON.stringify(brushColor)}`);
    handlePaintedPixels(paintedPixels => [...paintedPixels, { x: pixelData.x, y: pixelData.y, color: brushColor }]);
  };

  return (
    <div
      className={`relative w-full h-full cursor-pointer hover:bg-[var(--brush-color)] bg-[var(--bg-color)]`}
      style={
        {
          "--bg-color": `rgb(${color.r}, ${color.g}, ${color.b})`,
          "--brush-color": `rgb(${brushColor.r}, ${brushColor.g}, ${brushColor.b})`,
        } as React.CSSProperties
      }
      onClick={() => handleClick()}
    ></div>
  );
});

export default Pixel;
