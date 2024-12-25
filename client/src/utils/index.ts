export const formatAddress = (address: string) =>
  `${address.slice(0, 8)}...${address.slice(-6)}`;

export const areEqual = (a: any, b: any) => {
  return JSON.stringify(a) === JSON.stringify(b);
};
