import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ConnectWalletBtnWrapper, FooterLinksContainer } from "./styles/RootStyles";

import { apiEndpoint } from "../config";
import logo from "../assets/logo.svg";
import { GET } from "../utils/api";

const Root = () => {
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="container xl mx-auto">
      <div className="w-full h-20 flex justify-between">
        <img src={logo} height="65px" alt="Logo" />

        <div className="flex flex-row items-center gap-x-5">
          {address ? (
            <>
              <div>{address}</div>
              <button onClick={() => disconnect()}>Disconnect</button>
            </>
          ) : (
            <div>
              <button onClick={() => connect({ connector: connectors[0] })}>Login</button>
            </div>
          )}
        </div>
      </div>

      <Outlet />

      <div>
        <a href="https://t.me/winlabs_az" target="_blank" rel="noopener noreferrer">
          Blog
        </a>
      </div>
    </div>
  );
};

export default Root;
