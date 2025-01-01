import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { switchChain } from "@wagmi/core";
import { config } from "../config";
import { CANVAS_DEPLOYERS } from "../constants/contractAddresses";
import { CANVAS_DEPLOYER_ABI, CANVAS_ABI } from "../constants/abis";
import { useAccount, useWriteContract } from "wagmi";
import { getGasPrice } from "@wagmi/core";
import { formatEther } from "viem";
import {
  Overlay,
  ModalContainer,
  Title,
  InputContainer,
  SelectBox,
  Label,
  SubmitBtnContainer,
  Input,
} from "./styles/ModalStyles";

const Modal = ({ toggle }) => {
  const { chainId: accountChainId, address } = useAccount();

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

  const isNetworkSupported = config.chains.some(
    (chain) => chain.id === accountChainId
  );
  const isFormValid =
    name && height && width && isNetworkSupported && destinationAddress;

  const handleInitializeCanvas = async () => {
    if (!isFormValid) return;
    await writeContractAsync({
      functionName: "deployCanvas",
      args: [name, Number(height), Number(width), 600, destinationAddress],
      abi: CANVAS_DEPLOYER_ABI,
      address: CANVAS_DEPLOYERS[accountChainId],
      account: address,
    });
    toggle();

    const chain = config.chains.find((chain) => chain.id === accountChainId!)!;

    enqueueSnackbar(
      <>Canvas has been created and will be displayed soon.&nbsp;</>,
      { variant: "success" }
    );
  };

  const handleChainIdChange = (chainId: number) => {
    switchChain(config, { chainId }).then((data) => {});
  };

  useEffect(() => {
    //@ts-ignore
    allChainsGasPrices().then((data) => setGasPricesMap(data));
  }, []);

  const allChainsGasPrices = async () => {
    const gasPricesData = await Promise.all(
      config.chains.map((chain) =>
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
            {config.chains.map((chain) => (
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
