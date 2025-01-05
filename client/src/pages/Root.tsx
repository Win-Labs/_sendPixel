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
    <div className="container flex flex-col xl mx-auto h-full">
      <div className="w-full h-24 flex justify-between py-4 mb-8">
        <img src={logo} alt="Logo" className="h-16 w-auto object-contain" />

        <div className="flex flex-row items-center gap-x-5">
          {address ? (
            <>
              <span className="text-yellow-400">{address}</span>
              <button
                className="border-2 shadow-orange-400 rounded-md border-yellow-400 shadow-md color bg-yellow-400 px-6 py-2"
                onClick={() => disconnect()}
              >
                Disconnect
              </button>
            </>
          ) : (
            <div>
              <button
                className="border-2 shadow-orange-400 rounded-md border-yellow-400 shadow-md color bg-yellow-400 px-6 py-2"
                onClick={() => connect({ connector: connectors[0] })}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>

      <Outlet />

      <div className="w-full flex py-4 mt-auto">
        <a className="text-white" href="https://t.me/winlabs_az" target="_blank" rel="noopener noreferrer">
          Blog
        </a>
      </div>
    </div>
  );
};

export default Root;
