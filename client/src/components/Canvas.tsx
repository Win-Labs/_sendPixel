import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { useSendTransaction } from "wagmi";
import { backendUrl, supportedChains } from "../config";
import { ICanvas } from "../models";
import Pixel from "./Pixel";
import {
  notification,
  usePushNotifications,
} from "../utils/usePushNotifications";
import { useQuery } from "@tanstack/react-query";
import { GET } from "../utils/api";
import {
  BlockScoutLink,
  BoldText,
  CanvasHeader,
  CanvasHeaderLeft,
  CanvasHeaderRight,
  CenteredButtonContainer,
  InfoRow,
  PageContainer,
  PixelsContainer,
} from "./CanvasStyles";

export interface PixelItem {
  _id?: number;
  owner?: string | null;
  x: number;
  y: number;
  color: {
    r: number;
    g: number;
    b: number;
  };
}

const Canvas = () => {
  const { canvasId: paramCanvasId } = useParams();
  const navigate = useNavigate();
  const { user, isSubscribed } = usePushNotifications();
  const {
    data: hash,
    sendTransaction,
    isPending: isPixelTransactionPending,
  } = useSendTransaction();
  const {
    isPending: isPendingCanvas,
    error: errorCanvas,
    data: dataCanvas,
    refetch: refetchCanvas,
  } = useQuery({
    queryKey: ["pixels", paramCanvasId],
    queryFn: () => GET(`${backendUrl}/canvases/${paramCanvasId}`),
    enabled: !!paramCanvasId,
    refetchInterval: 3000,
  });

  const [canvas, setCanvas] = useState<ICanvas | null>(null);
  const [activePixelId, setActivePixelId] = useState<number | null>(null);
  const [pixels, setPixels] = useState<PixelItem[]>([]);
  const pixelsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (errorCanvas) {
      navigate("/");
    }
  }, [errorCanvas]);

  useEffect(() => {
    if (dataCanvas) {
      setCanvas(dataCanvas);
    }
  }, [dataCanvas]);

  useEffect(() => {
    if (canvas && canvas.width && canvas.height) {
      const grid = Array.from(
        { length: canvas.width * canvas.height },
        (_, index) => ({
          _id: index,
          owner: null,
          x: index % canvas.width,
          y: Math.floor(index / canvas.width),
          color: { r: 255, g: 255, b: 255 },
        })
      );
      dataCanvas.pixels.forEach((pixel) => {
        grid[pixel.y * canvas.width + pixel.x] = pixel;
      });
      setPixels(grid);
    }

    return () => {
      setPixels([]);
    };
  }, [canvas]);

  const handleClickOutside = (event) => {
    if (
      pixelsContainerRef.current &&
      !pixelsContainerRef.current.contains(event.target)
    ) {
      setActivePixelId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  async function encodeToNativeCoin(
    x: number,
    y: number,
    r: number,
    g: number,
    b: number
  ) {
    if (!canvas) return;

    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      throw new Error("RGB values must be between 0 and 255.");
    }
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
      throw new Error("Coordinates are out of canvas bounds.");
    }

    const packedValue =
      (BigInt(r) << 32n) |
      (BigInt(g) << 24n) |
      (BigInt(b) << 16n) |
      (BigInt(x) << 8n) |
      BigInt(y);

    console.log("Packed value:", packedValue.toString());

    sendTransaction({
      to: canvas.canvasId as `0x${string}`,
      value: packedValue,
    });

    if (isSubscribed) {
      notification(
        user,
        `Wallet ${user.account} colored canvas "${canvas.name}" to R${r} G${g} B${b} color at coordinates ${x}:${y}`
      );
    }

    return packedValue;
  }

  const onConstruct = (
    x: number,
    y: number,
    r: number,
    g: number,
    b: number
  ) => {
    console.log("Constructing Ethereum transaction...");
    encodeToNativeCoin(x, y, r, g, b);
  };

  useEffect(() => {
    refetchCanvas();
  }, [hash]);

  const chain = supportedChains.find(
    (chain) => chain.id === dataCanvas?.chainId
  );
  const explorerUrl = chain?.blockExplorers?.custom?.url || "";
  const fullUrl = `${explorerUrl}address/${canvas?.canvasId}`;

  return (
    <PageContainer>
      {isPendingCanvas ? (
        <div>Loading...</div>
      ) : (
        canvas && (
          <>
            const BoldText = styled.span` font-weight: bold; `; return (
            <CanvasHeader>
              <CanvasHeaderLeft>
                <h1>{canvas.name}</h1>
                <InfoRow>
                  <span>Canvas creator:</span>
                  <BoldText>{canvas.owner}</BoldText>
                </InfoRow>
                <InfoRow>
                  <span>Canvas resolution:</span>
                  <BoldText>
                    {canvas.width}x{canvas.height}
                  </BoldText>
                </InfoRow>
                <InfoRow>
                  <span>Funding recipient:</span>
                  <BoldText>{canvas.destination}</BoldText>
                </InfoRow>
                <InfoRow>
                  <span>Deployed network:</span>
                  <BoldText>
                    {
                      supportedChains.find(
                        (chain) => chain.id === canvas.chainId
                      )?.name
                    }
                  </BoldText>
                </InfoRow>
                <BlockScoutLink
                  href={fullUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Explore history on BlockScout
                </BlockScoutLink>
              </CanvasHeaderLeft>
              <CanvasHeaderRight>
                <div>Recommended image:</div>
                <img src={`https://noun.pics/${canvas.nounImageId}`} />
              </CanvasHeaderRight>
            </CanvasHeader>
            );
            <PixelsContainer
              width={canvas.width}
              height={canvas.height}
              ref={pixelsContainerRef}
            >
              {pixels.map((pixel) => (
                <Pixel
                  key={pixel._id}
                  pixelData={pixel}
                  onConstruct={onConstruct}
                  activePixelId={activePixelId}
                  setActivePixelId={setActivePixelId}
                  isPixelTransactionPending={isPixelTransactionPending}
                />
              ))}
            </PixelsContainer>
            <CenteredButtonContainer>
              <button className="btn btn-warning" onClick={() => navigate(-1)}>
                Back to Canvases
              </button>
            </CenteredButtonContainer>
          </>
        )
      )}
    </PageContainer>
  );
};

export default Canvas;
