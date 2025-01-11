import { useEffect } from "react";
import { CANVAS_DEPLOYERS } from "../constants/contractAddresses";
import { CANVAS_DEPLOYER_ABI } from "../constants/abis";
import { useAccount, useWriteContract } from "wagmi";

import { useTransactionReceipt } from "wagmi";
import { useFormState } from "../hooks/useFormState";
import Loader from "./Loader";

const Modal = ({ toggle }) => {
  const { chainId, address } = useAccount();

  const { formState, handleChange } = useFormState({
    name: "default",
    height: "8",
    width: "8",
    duration: "600",
  });

  const { writeContract, isPending, data } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toggle();
      },
    },
  });

  const { data: transactionReceipt } = useTransactionReceipt({
    hash: data,
    query: {
      enabled: !!data,
    },
  });

  const isFormValid = formState.name && formState.height && formState.width;

  const handleInitializeCanvas = async () => {
    if (!isFormValid || !chainId) return;

    const { name, height, width, duration } = formState;

    writeContract({
      functionName: "deployCanvas",
      args: [name, Number(height), Number(width), 0, Number(duration)],
      abi: CANVAS_DEPLOYER_ABI,
      address: CANVAS_DEPLOYERS[chainId] as `0x${string}`,
      account: address,
    });
  };

  useEffect(() => {
    console.log(transactionReceipt);
    console.log(isPending);
  }, [transactionReceipt, isPending]);

  return isPending || (data && !transactionReceipt) ? (
    <Loader />
  ) : (
    <div
      className="flex w-full h-full justify-center items-center fixed top-0 left-0 z-10 bg-black bg-opacity-50"
      onClick={toggle}
    >
      <div
        className="w-full z-20 max-w-lg bg-black p-7 pt-10 absolute rounded-lg border-2 border-yellow-500 shadow-lg"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <h2 className="mb-4 text-xl flex justify-center  text-yellow-500">Canvas Settings</h2>
        <div className="flex flex-col mb-3">
          <p>Name</p>
          <input
            className="border-2 shadow-orange-400 rounded-md border-yellow-500 shadow-md color px-6 py-2 text-yellow-500 bg-black"
            placeholder="Enter name of the canvas"
            type="text"
            value={formState.name}
            onChange={handleChange("name")}
          />
        </div>
        <div className="flex flex-col mb-3">
          <p>Width</p>
          <input
            className="border-2 shadow-orange-400 rounded-md border-yellow-500 shadow-md color px-6 py-2  text-yellow-500 bg-black"
            placeholder="Enter width of the canvas"
            type="text"
            value={formState.width}
            onChange={handleChange("width")}
          />
        </div>
        <div className="flex flex-col mb-8">
          <p>Height</p>
          <input
            className="border-2 shadow-orange-400 rounded-md border-yellow-500 shadow-md color px-6 py-2  text-yellow-500 bg-black"
            placeholder="Enter height of the canvas"
            type="text"
            value={formState.height}
            onChange={handleChange("height")}
          />
        </div>

        <div className="flex justify-center">
          <button
            className="border-2 shadow-orange-400 rounded-md border-yellow-400 shadow-md color px-6 py-2 text-yellow-500"
            onClick={handleInitializeCanvas}
            type="button"
            disabled={isPending || !isFormValid}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
