import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import * as s from "./styles/RootStyles";

import { apiEndpoint } from "../config";
import logo from "../assets/logo.svg";
import { GET } from "../utils/api";

const Root = () => {
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleClearDb = async () => {
    await GET(`${apiEndpoint}/clear`);
  };

  return (
    <div className="container" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div className="nav-bar-container mb-4">
        <div className="nav-bar-container-logo">
          <a className="nav-bar-container-logo-link" href="/">
            <img src={logo} height="65px" alt="Logo" />
          </a>
        </div>
        <div className="nav-bar-container-info">
          <div>
            {address ? (
              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <div style={{ color: "white" }}>{address}</div>

                <button
                  className="btn btn-warning"
                  onClick={() => {
                    disconnect();
                  }}
                >
                  Disconnect
                </button>
                <button
                  className="btn btn-warning"
                  onClick={() => {
                    handleClearDb();
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

      <Outlet />

      <s.FooterLinksContainer>
        <a href="https://t.me/winlabs_az" target="_blank" rel="noopener noreferrer" className="footer-link">
          Blog
        </a>
        <div>Branch: Grind</div>
      </s.FooterLinksContainer>
    </div>
  );
};

export default Root;
