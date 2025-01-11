import { useSendTransaction } from "wagmi";

export const useSignEachSend = () => {
  const { sendTransaction } = useSendTransaction();

  const signEachSend = async (to: `0x${string}`, values: bigint[]) => {
    try {
      const sendTransactionsResult = await Promise.all(
        values.map(async value => {
          try {
            const tx = sendTransaction({ to, value });
            return tx;
          } catch (error) {
            console.error(`Failed to send transaction with value: ${value}`, error);
            throw error;
          }
        }),
      );
      console.log(`Result of Promise.all:`, sendTransactionsResult);
      return sendTransactionsResult;
    } catch (error) {
      console.error("Error in signEachSend:", error);
      throw error;
    }
  };

  return { signEachSend };
};
