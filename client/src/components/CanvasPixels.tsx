import Pixel from "./Pixel";

const CanvasPixels = ({ pixels, brushColor, handlePaintedPixels, canvasProps }) => {
  return (
    <div className="flex p-4 border-4 border-yellow-500 bg-black">
      <div
        className="grid bg-black my-0 w-[500px] grid-cols-[repeat(var(--canvas-columns),1fr)] grid-rows-[repeat(var(--canvas-rows),1fr)] h-[calc(var(--canvas-height))]"
        style={
          {
            "--canvas-columns": canvasProps.width,
            "--canvas-rows": canvasProps.height,
            "--canvas-height": `calc(500px * ${canvasProps.height / canvasProps.width})`,
          } as React.CSSProperties
        }
      >
        {pixels.map(pixel => (
          <Pixel handlePaintedPixels={handlePaintedPixels} key={pixel._id} pixelData={pixel} brushColor={brushColor} />
        ))}
      </div>
    </div>
  );
};

export default CanvasPixels;
