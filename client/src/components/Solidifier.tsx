import React, { useEffect } from "react";
import { useSendTransaction } from "wagmi";
import Spinner from "./Spinner";

interface ISolidifierProps {
  pixels: { x: number; y: number; color: { r: number; g: number; b: number } }[];
  canvasId: string;
}

const Solidifier = ({ pixels, canvasId }: ISolidifierProps) => {
  const { data, sendTransaction, isPending } = useSendTransaction();

  function buildTransferAmount(x: number, y: number, r: number, g: number, b: number) {
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      throw new Error("RGB values must be between 0 and 255.");
    }

    const packedValue = (BigInt(r) << 32n) | (BigInt(g) << 24n) | (BigInt(b) << 16n) | (BigInt(x) << 8n) | BigInt(y);
    return packedValue;
  }

  async function transact() {
    const to = canvasId as `0x${string}`;

    const values = pixels.map(pixel =>
      buildTransferAmount(pixel.x, pixel.y, pixel.color.r, pixel.color.g, pixel.color.b),
    );

    console.log(values);
    const sendSransactionsResult = await Promise.all(values.map(value => sendTransaction({ to, value })));
    console.log(sendSransactionsResult);
  }

  useEffect(() => {
    console.log(`Transacted. Hash: ${data}`);
  }, [data]);

  return (
    <button
      className="py-1 px-10 text-yellow-500 bg-black flex justify-center items-center h-1/2 uppercase border-yellow-500 border-4"
      onClick={transact}
    >
      {isPending && <Spinner />} Solidify Art
    </button>
  );
};

export default Solidifier;
