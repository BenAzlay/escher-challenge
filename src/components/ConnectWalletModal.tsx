"use client";

import { Connector, useConnect, useDisconnect } from "wagmi";
import Modal from "@/components/Modal";
import { FC } from "react";

interface ConnectWalletModalProps {
  open: boolean;
  onClose: () => void;
}

const ConnectWalletModal: FC<ConnectWalletModalProps> = ({ open, onClose }) => {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = async (connector: Connector) => {
    connect(
      { connector },
      {
        onError: (error) => {
          console.error("WAGMI error", error);
          disconnect();
        },
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const getLogoForConnectorId = (connectorId: string): string => {
    switch (connectorId) {
      case "io.metamask":
        return "/wallets/Metamask.png";
      case "walletConnect":
        return "/wallets/WalletConnect.png";
      case "io.rabby":
        return "/wallets/Rabby.png";
      case "app.keplr":
        return "/wallets/Keplr.png";
      default:
        return "/tokenLogos/NOTFOUND.png";
    }
  };

  return (
    <Modal visible={open} title={"Select a Wallet"} onClose={onClose}>
      <ul>
        {connectors.map((connector) => (
          <li key={connector.id} className="mb-2">
            <button
              className="btn btn-secondary btn-outline w-full text-start"
              onClick={() => handleConnect(connector)}
            >
              <img
                src={
                  !!connector?.icon
                    ? connector.icon
                    : getLogoForConnectorId(connector.id)
                }
                width={18}
                height={18}
                className="rounded-md"
                alt={`${connector.name} logo`}
              />
              {connector.name}
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
};

export default ConnectWalletModal;
