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
  const [color, setColor] = useState(props.pixelData.color);

  const handleChange = useCallback(newColor => {
    setColor(newColor.rgb);
  }, []);

  const handlePropagation = useCallback(e => e.stopPropagation(), []);

  const handleConfirm = useCallback(() => {
    props.onConstruct(props.pixelData.x, props.pixelData.y, color.r, color.g, color.b);
  }, [color, props.onConstruct, props.pixelData]);

  const isActive = props.activePixelId === props.pixelData._id;

  return (
    <PixelContainer $color={color} onClick={() => props.setActivePixelId(props.pixelData._id!)}>
      {isActive && (
        <PaletteContainer onClick={handlePropagation}>
          <div>
            <div>Last owner:</div>
            <div>{props.pixelData?.owner || "none"}</div>
          </div>
          <SketchPicker color={color} onChange={handleChange} />
          <button onClick={handleConfirm} disabled={props.isPixelTransactionPending}>
            Confirm
          </button>
        </PaletteContainer>
      )}
    </PixelContainer>
  );
});

export default Pixel;
