import styled from "styled-components";

interface ColorProps {
  $color: {
    r: number;
    g: number;
    b: number;
  };
}

const PixelContainer = styled.div<ColorProps>`
  background-color: rgb(${({ $color }) => $color.r}, ${({ $color }) => $color.g}, ${({ $color }) => $color.b});
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

export { PixelContainer, PaletteContainer };
