import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import * as s from "./RootStyles";

import { backendUrl } from "../config";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoginClick = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (address) {
      setIsModalOpen(false);
    } else {
      navigate("/");
    }
  }, [address, navigate]);

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
