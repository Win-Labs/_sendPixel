import { useAccount } from "wagmi";
import { canvasDeployerAbi, DEPLOYER_CONTRACT_ADDRESSES } from "../common";
import { useWriteContract } from "wagmi";

const useWrite = () => {
  const { address } = useAccount();
  const {
    writeContract,
    data: hash,
    isPending: isHashPending,
    isSuccess,
    writeContractAsync,
  } = useWriteContract();

  const write = (functionName, args, network: number) => {
    writeContract({
      abi: canvasDeployerAbi,
      address: DEPLOYER_CONTRACT_ADDRESSES[network],
      functionName,
      args,
      account: address,
    });
  };

  const writeAsync = (functionName, args, network: number) => {
    return writeContractAsync({
      abi: canvasDeployerAbi,
      address: DEPLOYER_CONTRACT_ADDRESSES[network],
      functionName,
      args,
      account: address,
    });
  };

  return { write, hash, isHashPending, isSuccess, writeAsync };
};

export default useWrite;
