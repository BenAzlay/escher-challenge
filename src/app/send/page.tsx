"use client";

import { Fragment, useMemo, useState } from "react";
import SwitchChainButton from "@/components/SwitchChainButton";
import { useAccount, useBalance, useSendTransaction } from "wagmi";
import { sepolia } from "viem/chains";
import TransactionButton from "@/components/TransactionButton";
import TextField from "@/components/TextField";
import { useWallet } from "../ClientProviders";
import TokenAmountField from "@/components/TokenAmountField";
import {
  compareEthereumAddresses,
  convertQuantityToWei,
} from "@/utils/utilFunc";
import { ethers } from "ethers";
import { useVisibilityIntervalEffect } from "@/utils/customHooks";

function App() {
  const { address: connectedAddress, chainId: connectedChainId } = useAccount();

  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    address: connectedAddress as `0x${string}`,
    chainId: sepolia.id,
  });

  const { setConnectWalletModalOpen } = useWallet();

  const [receiverAddress, setReceiverAddress] = useState<string>("");
  const [ethAmount, setEthAmount] = useState<string>("");
  const [txError, setTxError] = useState<string | null>(null);
  const [ethPrice, setEthPrice] = useState<string>("0");

  const getEthPrice = async () => {
    try {
      const response = await fetch("/api/getEthPrice");
      const data = await response.json();
      setEthPrice(data.price);
    } catch (error) {
      console.error("getEthPrice ERROR", error);
      setEthPrice("0");
    }
  };

  useVisibilityIntervalEffect(getEthPrice, 60000, []);

  const ethAmountWei = useMemo(
    () => convertQuantityToWei(ethAmount, 18),
    [ethAmount]
  );

  const ethAmountError = useMemo(() => {
    if (!ethAmount.length) return null; // Don't show error for empty input
    if (Number(ethAmountWei) > Number(balanceData?.value ?? 0)) {
      return "Amount cannot be greater than wallet balance";
    }
    if (Number(ethAmountWei) === Number(balanceData?.value ?? 0)) {
      return "You cannot send all your ETH";
    }
    return null;
  }, [balanceData, ethAmountWei]);

  const receiverAddressError = useMemo(() => {
    if (!receiverAddress.length) return null; // Don't show error for empty input
    if (!ethers.isAddress(receiverAddress)) {
      return "Invalid address";
    }
    if (compareEthereumAddresses(connectedAddress, receiverAddress)) {
      return "Cannot send ETH to yourself";
    }
    return null;
  }, [connectedAddress, receiverAddress]);

  const { sendTransaction, isPending } = useSendTransaction();

  const handleSendTransaction = () => {
    if (!receiverAddress || !ethAmount || receiverAddressError) return;
    setTxError(null);
    sendTransaction(
      {
        to: receiverAddress as `0x${string}`,
        value: BigInt(ethAmountWei),
        chainId: sepolia.id,
      },
      {
        onSuccess: () => {
          setEthAmount("");
          setReceiverAddress("");
        },
        onError: (error) => {
          setTxError(error.message);
        },
      }
    );
  };

  const transactionButton = () => {
    if (!connectedAddress)
      return (
        <TransactionButton
          onClickAction={() => setConnectWalletModalOpen(true)}
        >
          SIGN IN
        </TransactionButton>
      );
    if (connectedChainId !== sepolia.id) return <SwitchChainButton />;
    return (
      <TransactionButton
        disabled={
          isPending || !receiverAddress.length || !!receiverAddressError
        }
        onClickAction={handleSendTransaction}
        loading={isPending}
        errorMessage={txError}
      >
        SEND ETH
      </TransactionButton>
    );
  };

  return (
    <Fragment>
      <div className="py-12 justify-items-center">
        <div className="max-w-xl w-full text-center space-y-6 border-primary border-2 rounded-md p-6 glass-bg">
          <TokenAmountField
            amount={ethAmount}
            onChangeAmount={(value) => setEthAmount(value)}
            showTokenBalance={true}
            tokenBalance={balanceData?.formatted}
            balanceIsLoading={balanceLoading}
            tokenPrice={Number(ethPrice)}
            error={ethAmountError}
          />
          <TextField
            value={receiverAddress}
            onChangeValue={(value) => setReceiverAddress(value)}
            error={receiverAddressError}
          />
          {transactionButton()}
        </div>
      </div>
    </Fragment>
  );
}

export default App;
