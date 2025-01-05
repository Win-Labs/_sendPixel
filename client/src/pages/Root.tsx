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
    <div className="w-full ">
      <div className="w-full flex justify-between">
        <div>
          <a href="/">
            <img src={logo} height="65px" alt="Logo" />
          </a>
        </div>

        <div className="flex flex-row items-center">
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

      {/* <Outlet /> */}

      {/* <FooterLinksContainer>
        <a href="https://t.me/winlabs_az" target="_blank" rel="noopener noreferrer">
          Blog
        </a>
        <div>Branch: Grind</div>
      </FooterLinksContainer> */}
    </div>
  );
};

export default Root;
