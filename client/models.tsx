interface Color {
  r: number;
  g: number;
  b: number;
}

interface Pixel {
  _id: string;
  owner: string;
  x: number;
  y: number;
  color: Color;
}

export interface ICanvas {
  _id: string;
  owner: string;
  width: number;
  height: number;
  pixels: Pixel[];
  totalAmount: string;
}
