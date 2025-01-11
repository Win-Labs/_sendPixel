import { SketchPicker } from "react-color";
import { MouseEvent } from "react";

interface IColorPickerProps {
  brushColor: { r: number; g: number; b: number };
  handleBrushColor: (color: { r: number; g: number; b: number }) => void;
}

const ColorPicker = ({ brushColor, handleBrushColor }: IColorPickerProps) => {
  const handleChange = (newColor: { rgb: { r: number; g: number; b: number } }) => {
    handleBrushColor(newColor.rgb);
  };

  const handlePropagation = (event: MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div
      className="flex flex-col p-4  bg-black rounde-lg text-yellow-500 border-4 border-yellow-500"
      onClick={handlePropagation}
    >
      <SketchPicker width="300px" color={brushColor} onChange={handleChange} />
    </div>
  );
};

export default ColorPicker;
