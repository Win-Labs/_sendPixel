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
  canvasId: string;
  owner: string;
  name: string;
  width: number;
  height: number;
  mode: number;
  worldIdVerified: boolean;
  pixels: Pixel[];
  __v: number;
  chainId: number;
  destination: string;
  creationTime: number;
  totalAmount: string;
  isListed: boolean;
  isSold: boolean;
  nounImageId: number;
}
