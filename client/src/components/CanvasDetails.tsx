import React from "react";
import { formatAddress } from "../utils";

interface ICanvasDetails {
  name: string;
  owner: string;
  width: number;
  height: number;
}

const CanvasDetails = (props: ICanvasDetails) => {
  return (
    <div className="flex flex-col bg-black text-yellow-500 border-4 border-yellow-500 p-10">
      <div className="flex justify-between gap-10">
        <span>NAME:</span>
        <span className="font-bold">{props.name}</span>
      </div>
      <div className="flex justify-between gap-10">
        <span>CREATOR:</span>
        <span className="font-bold">{formatAddress(props.owner)}</span>
      </div>
      <div className="flex justify-between gap-10">
        <span>RESOLUTION:</span>
        <span className="font-bold">
          {props.width}x{props.height}
        </span>
      </div>
    </div>
  );
};

export default CanvasDetails;
