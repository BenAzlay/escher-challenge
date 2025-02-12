"use client";

import React from "react";
import { sepolia } from "viem/chains";
import { useSwitchChain } from "wagmi";

const SwitchChainButton: React.FC = () => {
  const { switchChain } = useSwitchChain();

  return (
    <button
      className="btn btn-primary w-full"
      onClick={() => switchChain({ chainId: sepolia.id })}
    >
      SWITCH TO SEPOLIA
    </button>
  );
};

export default SwitchChainButton;
