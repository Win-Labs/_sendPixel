import React from "react";
import { useState } from "react";
import { SketchPicker } from "react-color";

interface IColorPickerProps {
  brushColor: { r: number; g: number; b: number };
  handleBrushColor: (color: { r: number; g: number; b: number }) => void;
}

const ColorPicker = (props: IColorPickerProps) => {
  const [color, setColor] = useState(props.brushColor);

  const handleChange = newColor => {
    setColor(newColor.rgb);
  };

  const handlePropagation = event => {
    event.stopPropagation();
  };

  const handleConfirm = () => {
    props.handleBrushColor(color);
  };

  return (
    <div
      className="flex w-auto items-center flex-col gap-2.5 p-2.5 z-[100] top-[100%] bg-black rounded-lg text-yellow-500 border-4 border-yellow-500"
      onClick={handlePropagation}
    >
      <SketchPicker color={color} onChange={handleChange} />
      <button onClick={handleConfirm}>Confirm</button>
    </div>
  );
};

export default ColorPicker;
