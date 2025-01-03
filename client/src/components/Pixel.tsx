import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import styled from "styled-components";
import { SketchPicker } from "react-color";
import { PixelItem } from "./Canvas";

interface ColorProps {
  $color: {
    r: number;
    g: number;
    b: number;
  };
}

const PixelContainer = styled.div<ColorProps>`
  background-color: rgb(
    ${({ $color }) => $color.r},
    ${({ $color }) => $color.g},
    ${({ $color }) => $color.b}
  );
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  &: hover {
    border: 1px solid black;
  }
`;

const PaletteContainer = styled.div`
  position: absolute;
  z-index: 100;
  top: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: darkgray;
  padding: 10px;
  border-radius: 5px;
`;

interface IProps {
  pixelData: PixelItem;
  onConstruct: (x: number, y: number, r: number, g: number, b: number) => void;
  activePixelId: number | null;
  setActivePixelId: Dispatch<SetStateAction<number | null>>;
  isPixelTransactionPending: boolean;
}

const Pixel: React.FC<IProps> = React.memo((props) => {
  const [color, setColor] = useState(props.pixelData.color);

  const handleChange = useCallback((newColor) => {
    setColor(newColor.rgb);
  }, []);

  const handlePropagation = useCallback((e) => e.stopPropagation(), []);

  const handleConfirm = useCallback(() => {
    props.onConstruct(
      props.pixelData.x,
      props.pixelData.y,
      color.r,
      color.g,
      color.b
    );
  }, [color, props.onConstruct, props.pixelData]);

  const isActive = props.activePixelId === props.pixelData._id;

  return (
    <PixelContainer
      $color={color}
      onClick={() => props.setActivePixelId(props.pixelData._id!)}
    >
      {isActive && (
        <PaletteContainer onClick={handlePropagation}>
          <div
            style={{
              color: "white",
              fontSize: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div>Last owner:</div>
            <div>{props.pixelData?.owner || "none"}</div>
          </div>
          <SketchPicker color={color} onChange={handleChange} />
          <button
            className="btn btn-warning"
            onClick={handleConfirm}
            disabled={props.isPixelTransactionPending}
          >
            Confirm
          </button>
        </PaletteContainer>
      )}
    </PixelContainer>
  );
});

export default Pixel;
