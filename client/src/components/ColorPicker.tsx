import React from "react";
import { useState } from "react";
import { SketchPicker } from "react-color";

interface IColorPickerProps {
  brushColor: { r: number; g: number; b: number };
  handleBrushColor: (color: { r: number; g: number; b: number }) => void;
}

const ColorPicker = ({ brushColor, handleBrushColor }: IColorPickerProps) => {
  const handleChange = newColor => {
    handleBrushColor(newColor.rgb);
  };

  const handlePropagation = event => {
    event.stopPropagation();
  };

  return (
    <div
      className="flex flex-col gap-2.5 p-2.5  bg-black rounde-lg text-yellow-500 border-4 border-yellow-500"
      onClick={handlePropagation}
    >
      <SketchPicker width="320px" color={brushColor} onChange={handleChange} />
    </div>
  );
};

export default ColorPicker;
