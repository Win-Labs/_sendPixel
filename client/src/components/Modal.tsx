import { useEffect, useState } from "react";
import { CANVAS_DEPLOYERS } from "../constants/contractAddresses";
import { CANVAS_DEPLOYER_ABI, CANVAS_ABI } from "../constants/abis";
import { useAccount, useWriteContract } from "wagmi";
import { Overlay, ModalContainer, Title, InputContainer, Label, SubmitBtnContainer, Input } from "./styles/ModalStyles";
import { useTransactionReceipt } from "wagmi";
import { useFormState } from "../hooks/useFormState";

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
  });

  const isFormValid = formState.name && formState.height && formState.width;

  const handleInitializeCanvas = async () => {
    if (!isFormValid || !chainId) return;

    const { name, height, width, duration } = formState;

    writeContract({
      functionName: "deployCanvas",
      args: [name, Number(height), Number(width), 0, Number(duration)],
      abi: CANVAS_DEPLOYER_ABI,
      address: CANVAS_DEPLOYERS[chainId],
      account: address,
    });
  };

  useEffect(() => {
    if (transactionReceipt) {
      toggle();
    }
  }, [transactionReceipt]);

  return (
    <Overlay onClick={toggle}>
      <ModalContainer
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <Title>Canvas Parameters</Title>
        <InputContainer>
          <Label>Canvas Name</Label>
          <Input
            placeholder="Enter name of the canvas"
            type="text"
            value={formState.name}
            onChange={handleChange("name")}
          />
        </InputContainer>
        <InputContainer>
          <Label>Width</Label>
          <Input
            placeholder="Enter width of the canvas"
            type="text"
            value={formState.width}
            onChange={handleChange("width")}
          />
        </InputContainer>
        <InputContainer>
          <Label>Height</Label>
          <Input
            placeholder="Enter height of the canvas"
            type="text"
            value={formState.height}
            onChange={handleChange("height")}
          />
        </InputContainer>

        <SubmitBtnContainer>
          <button
            onClick={handleInitializeCanvas}
            className="btn btn-warning"
            type="button"
            disabled={isPending || !isFormValid}
          >
            Create Canvas
          </button>
        </SubmitBtnContainer>
      </ModalContainer>
    </Overlay>
  );
};

export default Modal;
