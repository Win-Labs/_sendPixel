import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import * as s from "./RootStyles";
import { useEthersSigner } from "../hooks/useEtherSigner";
import {
  notification,
  usePushNotifications,
} from "../utils/usePushNotifications";
import { CONSTANTS, PushAPI } from "@pushprotocol/restapi";
import { backendUrl, groupChatId } from "../config";
import { usePrivy, useLogout } from "@privy-io/react-auth";
import { enqueueSnackbar } from "notistack";
import logo from "../assets/logo.svg";

const Root = () => {
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleClearDb = async () => {
    try {
      await fetch(`${backendUrl}/clear`, {
        method: "GET",
      });
    } catch (error) {
      console.error("Error in handleClearDb:", error.message);
    }
  };

  const navigate = useNavigate();
  const signer = useEthersSigner();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    isSubscribed,
    setUser,
    setIsSubscribed,
    setIsSubscribtionLoading,
    isSubscribtionLoading,
  } = usePushNotifications();
  const handleLoginClick = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (address) {
      setIsModalOpen(false);
    } else {
      navigate("/");
    }
  }, [address, navigate]);

  const { login } = usePrivy();
  const { logout } = useLogout();

  const handleSubscribe = async () => {
    setIsSubscribtionLoading(true);
    try {
      const user = await PushAPI.initialize(signer, {
        env: CONSTANTS.ENV.STAGING,
      });
      await user.chat.group.join(groupChatId);
      const stream = await user.initStream([CONSTANTS.STREAM.CHAT]);
      stream.on(CONSTANTS.STREAM.CHAT, (data) => {
        console.log("message: ", data);
        const from = data.from.split(":")[1];
        if (from !== address) {
          enqueueSnackbar(data?.message?.content, { variant: "success" });
        }
      });
      stream.connect();
      setUser(user);
      setIsSubscribed(true);
      notification(user, `${address} has joined the chat.`);
    } catch (e) {
      enqueueSnackbar("Enable to join the chat", { variant: "error" });
    } finally {
      setIsSubscribtionLoading(false);
    }
  };

  return (
    <div
      className="container"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div className="nav-bar-container mb-4">
        <div className="nav-bar-container-logo">
          <a className="nav-bar-container-logo-link" href="/">
            <img src={logo} height="65px" alt="Logo" />
          </a>
        </div>
        <div className="nav-bar-container-info">
          <div>
            {address ? (
              <div
                style={{ display: "flex", gap: "20px", alignItems: "center" }}
              >
                <div style={{ color: "white" }}>{address}</div>
                {!isSubscribed && (
                  <button
                    onClick={handleSubscribe}
                    className="btn btn-warning"
                    type="button"
                    disabled={isSubscribtionLoading}
                  >
                    {isSubscribtionLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          aria-hidden="true"
                          style={{ marginRight: "10px" }}
                        ></span>
                        <span role="status">Joining...</span>
                      </>
                    ) : (
                      <>🔔 Channel</>
                    )}
                  </button>
                )}
                {isSubscribed && (
                  <button className="btn btn-warning">
                    🔔 Joined to channel!
                  </button>
                )}
                <button
                  className="btn btn-warning"
                  onClick={() => {
                    disconnect();
                    try {
                      logout();
                    } catch (e) {
                      console.log("Error: ", e);
                    }
                  }}
                >
                  Disconnect
                </button>
                <button
                  className="btn btn-warning"
                  onClick={() => {
                    handleClearDb();
                    try {
                      logout();
                    } catch (e) {
                      console.log("Error: ", e);
                    }
                  }}
                >
                  Clear DB
                </button>
              </div>
            ) : (
              <s.ConnectWalletBtnWrapper>
                <button className="btn btn-warning" onClick={handleLoginClick}>
                  Login
                </button>
              </s.ConnectWalletBtnWrapper>
            )}
          </div>
        </div>
      </div>

      <Outlet context={{ address }} />

      <s.FooterLinksContainer>
        <a
          href="https://t.me/winlabs_az"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          Blog
        </a>
        <div>Branch: Grind</div>
      </s.FooterLinksContainer>

      {isModalOpen && (
        <s.ModalOverlay>
          <s.ModalContainer>
            <h2>Login</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: "100%",
              }}
            >
              {connectors.map((connector) => (
                <button
                  className="btn btn-warning"
                  key={connector.id}
                  onClick={() => connect({ connector })}
                >
                  {connector.name}
                </button>
              ))}
              <button className="btn btn-warning" onClick={login}>
                Privy
              </button>
            </div>
            <button className="btn btn-warning" onClick={closeModal}>
              Close
            </button>
          </s.ModalContainer>
        </s.ModalOverlay>
      )}
    </div>
  );
};

export default Root;
