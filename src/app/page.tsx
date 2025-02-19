"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { abi as EscherAbi } from "@/abi/EscherAbi";
import { readContract } from "wagmi/actions";
import { config } from "@/wagmiConfig";
import CONSTANTS from "@/utils/constants";
import SwitchChainButton from "@/components/SwitchChainButton";
import { useAccount } from "wagmi";
import { sepolia } from "viem/chains";
import TransactionButton from "@/components/TransactionButton";
import useContractTransaction from "@/utils/useContractTransaction";
import { useWallet } from "./ClientProviders";
import NumberField from "@/components/NumberField";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const { ESCHER_CONTRACT } = CONSTANTS;

function App() {
  const { address: connectedAddress, chainId: connectedChainId } = useAccount();

  const { setConnectWalletModalOpen } = useWallet();

  const [favoriteNumber, setFavoriteNumber] = useState<number>(0);
  const [loadingRiddle, setLoadingNumber] = useState<boolean>(true);
  const [userNumber, setUserNumber] = useState<string>("");
  const [txError, setTxError] = useState<string | null>(null);
  const hasFetchedNumber = useRef(false); // Prevents duplicate fetch on mount
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchHistoricalData() {
      const response = await fetch("/api/getEthHistoricalPrices");

      if (response.status !== 200) return;

      const data = await response.json();

      // Format data for Recharts
      const formattedData = data.map(
        (entry: { time: number; value: number }) => ({
          time: new Date(entry.time * 1000).toLocaleDateString(),
          price: entry.value,
        })
      );

      setChartData(formattedData);
    }

    fetchHistoricalData();
  }, []);

  // Gets the active riddle and sets it in the store
  // If there is no active riddle, the bot submits a new one with setRiddle
  const getFavoriteNumber = async (): Promise<void> => {
    try {
      setLoadingNumber(true);
      const result = await readContract(config, {
        address: ESCHER_CONTRACT as `0x${string}`,
        abi: EscherAbi,
        chainId: 11155111,
        functionName: "retrieve",
      });

      setFavoriteNumber(Number(result));
    } catch (error) {
      console.error("getFavoriteNumber ERROR:", error);
    } finally {
      setLoadingNumber(false);
    }
  };

  // Run `getFavoriteNumber` only once on mount
  useEffect(() => {
    if (!hasFetchedNumber.current) {
      hasFetchedNumber.current = true;
      getFavoriteNumber();
    }
  }, [getFavoriteNumber]);

  // storeNumber tx hook
  const {
    isPending: storeNumberIsPending,
    executeTransaction: executeStoreNumberTransaction,
  } = useContractTransaction({
    abi: EscherAbi,
    contractAddress: CONSTANTS.ESCHER_CONTRACT as `0x${string}`,
    functionName: "store",
    args: [BigInt(userNumber)],
    onSuccess: async () => {
      // Reset input
      setUserNumber("");
      // Fetch new number from chain
      getFavoriteNumber();
    },
    onError: (errorMessage) => {
      setTxError(errorMessage);
    },
  });

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
        disabled={storeNumberIsPending || loadingRiddle || !userNumber.length}
        onClickAction={executeStoreNumberTransaction}
        loading={storeNumberIsPending}
        errorMessage={txError}
      >
        STORE NUMBER
      </TransactionButton>
    );
  };

  return (
    <Fragment>
      <div className="py-12 justify-items-center">
        <div className="max-w-lg text-center space-y-6 border-primary border-2 rounded-md p-6 glass-bg">
          <p className="rounded-md w-full border-secondary border-2 font-bold font-nimbus text-secondary text-start py-2 px-4">
            {loadingRiddle ? (
              "Loading favorite number..."
            ) : (
              <span>
                Your favorite number is: <b>{favoriteNumber}</b>
              </span>
            )}
          </p>
          <NumberField
            value={userNumber}
            onChangeValue={(value) => setUserNumber(value)}
          />
          {transactionButton()}
        </div>
      </div>
      <div className="px-2 sm:px-12 space-y-4">
        <h2 className="text-xl font-bold text-primary">ETH/USD price</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#6B46C1" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Fragment>
  );
}

export default App;
