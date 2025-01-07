import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import { SketchPicker } from "react-color";
import { PixelItem } from "./Canvas";
import { PaletteContainer, PixelContainer } from "./styles/PixelStyles";

interface IProps {
  pixelData: PixelItem;
  onConstruct: (x: number, y: number, r: number, g: number, b: number) => void;
  activePixelId: number | null;
  setActivePixelId: Dispatch<SetStateAction<number | null>>;
  isPixelTransactionPending: boolean;
}

const Pixel: React.FC<IProps> = React.memo(props => {
  const [color, setColor] = useState(props.pixelData.color || { r: 255, g: 255, b: 255 });

  const handleChange = useCallback(newColor => {
    setColor(newColor.rgb);
  }, []);

  const handlePropagation = useCallback(e => e.stopPropagation(), []);

  const handleConfirm = useCallback(() => {
    props.onConstruct(props.pixelData.x, props.pixelData.y, color.r, color.g, color.b);
  }, [color, props.onConstruct, props.pixelData]);

  const isActive = props.activePixelId === props.pixelData._id;

  return (
    <div
      className={`relative w-full h-full cursor-pointer hover:border-2 border-black bg-[var(--bg-color)]`}
      style={{ "--bg-color": `rgb(${color.r}, ${color.g}, ${color.b})` } as React.CSSProperties}
      onClick={() => props.setActivePixelId(props.pixelData._id!)}
    >
      {isActive && (
        <div
          className="flex flex-col absolute gap-2.5 p-2.5 z-[100] top-[100%] bg-gray-200 rounded-lg"
          onClick={handlePropagation}
        >
          <div>
            <div>Last owner:</div>
            <div>{props.pixelData?.owner || "none"}</div>
          </div>
          <SketchPicker color={color} onChange={handleChange} />
          <button onClick={handleConfirm} disabled={props.isPixelTransactionPending}>
            Confirm
          </button>
        </div>
      )}
    </div>
  );
});

export default Pixel;
