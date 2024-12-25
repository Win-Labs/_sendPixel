import { useEffect, useState } from "react";
import styled from "styled-components";
import { enqueueSnackbar } from "notistack";
import { switchChain } from "@wagmi/core";
import {
  config,
  supportedChains,
  canvasDeployerAbi,
  DEPLOYER_CONTRACT_ADDRESSES,
} from "../config";
import { useAccount, useWriteContract } from "wagmi";
import {
  notification,
  usePushNotifications,
} from "../utils/usePushNotifications";
import { getGasPrice } from "@wagmi/core";
import { formatEther } from "viem";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  width: 100%;
  z-index: 2;
  max-width: 500px;
  border-radius: 10px;
  gap: 10px;
  padding: 30px;
  background-color: #fff;
  position: absolute;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const SelectBox = styled.select`
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
`;

const Label = styled.p``;

const SubmitBtnContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
`;

const Modal = ({ toggle }) => {
  const { chainId: accountChainId, address } = useAccount();

  const { user, isSubscribed } = usePushNotifications();
  const {
    writeContractAsync,
    data: hashInitializeCanvas,
    isPending: initializeCanvasIsHashPending,
  } = useWriteContract();

  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [destinationAddress, setDestinationAddress] = useState<string>(
    String(address)
  );
  const [gasPricesMap, setGasPricesMap] = useState<Map<number, string>>(
    new Map()
  );

  const isNetworkSupported = supportedChains.some(
    (chain) => chain.id === accountChainId
  );
  const isFormValid =
    name && height && width && isNetworkSupported && destinationAddress;

  const handleInitializeCanvas = async () => {
    const hash = await writeContractAsync({
      functionName: "deployCanvas",
      args: [name, Number(height), Number(width), "", destinationAddress],
      abi: canvasDeployerAbi,
      address: DEPLOYER_CONTRACT_ADDRESSES[accountChainId as number],
      account: address,
    });
    toggle();

    if (isSubscribed) {
      notification(
        user,
        `Wallet ${user.account} created "${name}" (${width}x${height})`
      );
    }

    const chain = supportedChains.find(
      (chain) => chain.id === accountChainId!
    )!;
    const explorerUrl = chain.blockExplorers.custom.url;
    const fullUrl = `${explorerUrl}tx/${hash}`;

    enqueueSnackbar(
      <>
        Canvas has been created and will be displayed soon.&nbsp;
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecoration: "underline" }}
        >
          View on Blockscout
        </a>
      </>,
      { variant: "success" }
    );
  };

  const handleChainIdChange = (chainId: number) => {
    switchChain(config, { chainId }).then((data) => {
      console.log("Switched chain: ", data);
    });
  };

  useEffect(() => {
    console.log("hashInitializeCanvas", hashInitializeCanvas);
  }, [hashInitializeCanvas]);

  useEffect(() => {
    console.log("chain id", accountChainId);
  }, [accountChainId]);

  useEffect(() => {
    //@ts-ignore
    allChainsGasPrices().then((data) => setGasPricesMap(data));
  }, []);

  const allChainsGasPrices = async () => {
    const gasPricesData = await Promise.all(
      supportedChains.map((chain) =>
        getGasPrice(config, { chainId: chain.id }).then((price) => ({
          chainId: chain.id,
          price,
        }))
      )
    );
    const gasPricesMap = new Map<number, string>();
    gasPricesData.forEach((data) => {
      gasPricesMap.set(data.chainId, formatEther(data.price));
    });
    return gasPricesMap;
  };

  return (
    <Overlay onClick={toggle}>
      <ModalContainer
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Title>Canvas Parameters</Title>
        <InputContainer>
          <Label>Canvas Name</Label>
          <Input
            placeholder="Enter name of the canvas"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </InputContainer>
        <InputContainer>
          <Label>Width</Label>
          <Input
            placeholder="Enter width of the canvas"
            type="text"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
        </InputContainer>
        <InputContainer>
          <Label>Height</Label>
          <Input
            placeholder="Enter height of the canvas"
            type="text"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </InputContainer>
        <InputContainer>
          <Label>Beneficiary Wallet Address</Label>
          <Input
            type="text"
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
          />
        </InputContainer>
        <InputContainer>
          <Label>Network</Label>
          <SelectBox
            onChange={(e) => handleChainIdChange(+e.target.value)}
            value={isNetworkSupported ? accountChainId : ""}
          >
            <option value="" disabled>
              Network with chain ID: {accountChainId} is not supported
            </option>
            {supportedChains.map((chain) => (
              <option
                key={chain.id}
                value={chain.id}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>{chain.name}</span>{" "}
                {gasPricesMap?.get(chain.id) && (
                  <span style={{ float: "right" }}>
                    (gas price: {gasPricesMap?.get(chain.id) || 0} ETH)
                  </span>
                )}
              </option>
            ))}
          </SelectBox>
        </InputContainer>
        <SubmitBtnContainer>
          <button
            onClick={handleInitializeCanvas}
            className="btn btn-warning"
            type="button"
            disabled={initializeCanvasIsHashPending || !isFormValid}
          >
            {initializeCanvasIsHashPending ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  aria-hidden="true"
                  style={{ marginRight: "10px" }}
                ></span>
                <span role="status">Loading...</span>
              </>
            ) : (
              <>Create Canvas</>
            )}
          </button>
        </SubmitBtnContainer>
      </ModalContainer>
    </Overlay>
  );
};

export default Modal;
