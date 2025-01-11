import { useAccount, useWriteContract } from "wagmi";
import { CANVAS_ABI } from "../constants/abis";

export const useSignBatchSend = () => {
  const { address } = useAccount();
  const { writeContract, isPending, data, isError, error } = useWriteContract();

  const signBatchSend = async (to: `0x${string}`, values: bigint[]) => {
    writeContract({
      functionName: "batchSend",
      args: [values],
      abi: CANVAS_ABI,
      address: to,
      account: address,
      value: values.reduce((acc, val) => acc + val, 0n),
    });
  };
  return { signBatchSend, isPending, data, isError, error };
};