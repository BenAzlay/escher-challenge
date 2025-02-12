"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { abi as RiddlrAbi } from "@/abi/RiddlrAbi";
import { readContract, readContracts } from "wagmi/actions";
import { config } from "@/wagmiConfig";
import CONSTANTS from "@/utils/constants";
import { ethers, ZeroAddress } from "ethers";
import SwitchChainButton from "@/components/SwitchChainButton";
import { useAccount } from "wagmi";
import { sepolia } from "viem/chains";
import TransactionButton from "@/components/TransactionButton";
import useContractTransaction from "@/utils/useContractTransaction";
import ConnectWalletModal from "@/components/ConnectWalletModal";
import TextField from "@/components/TextField";
import { compareEthereumAddresses } from "@/utils/utilFunc";

const { RIDDLR_CONTRACT } = CONSTANTS;

function App() {
  const { address: connectedAddress, chainId: connectedChainId } = useAccount();

  const [activeRiddle, setActiveRiddle] = useState<string>("");
  const [loadingRiddle, setLoadingRiddle] = useState<boolean>(true);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [txError, setTxError] = useState<string | null>(null);
  const [connectWalletModalOpen, setConnectWalletModalOpen] =
    useState<boolean>(false);
  const hasFetchedRiddle = useRef(false); // Prevents duplicate fetch on mount

  const noActiveRiddle = useMemo(() => !activeRiddle.length, [activeRiddle]);

  const setRiddle = async (
    riddle: string,
    answer: string
  ): Promise<boolean> => {
    const answerHash = ethers.keccak256(ethers.toUtf8Bytes(answer)); // Hashing the answer

    const response = await fetch("/api/setRiddle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ riddle, answerHash }),
    });

    const data = await response.json();
    if (data.success) {
      console.log("Transaction Hash:", data.txHash);
    } else {
      console.error("Error:", data.error);
    }
    return data.success;
  };

  // Gets the active riddle and sets it in the store
  // If there is no active riddle, the bot submits a new one with setRiddle
  const getActiveRiddle = async (): Promise<void> => {
    try {
      setLoadingRiddle(true);
      const rawResults = await readContracts(config, {
        contracts: [
          {
            address: RIDDLR_CONTRACT as `0x${string}`,
            abi: RiddlrAbi,
            chainId: 11155111,
            functionName: "riddle",
          },
          {
            address: RIDDLR_CONTRACT as `0x${string}`,
            abi: RiddlrAbi,
            chainId: 11155111,
            functionName: "isActive",
          },
        ],
      });

      const [riddle, isActive] = rawResults.map(({ result }) => result);
      console.log(`isActive:`, isActive);
      console.log(`riddle:`, riddle);

      // IF there is an active riddle, set it in the store
      if (!!isActive) {
        setActiveRiddle(riddle as string);
        return;
      }
      // ELSE perform bot transaction to submit a new riddle
      const { RIDDLES: riddlesList } = CONSTANTS;
      let newRiddleIndex: number;
      const activeRiddleIndex = riddlesList.findIndex(
        ({ question }) => question === riddle
      );
      // If no riddle was ever set OR we had reached the last riddle of the list, go back to first riddle of the list
      // Else increment index to get to next riddle in the list
      if (
        activeRiddleIndex < 0 ||
        activeRiddleIndex === riddlesList.length - 1
      ) {
        newRiddleIndex = 0;
      } else {
        newRiddleIndex = activeRiddleIndex + 1;
      }
      const { question: newQuestion, answer } = riddlesList[newRiddleIndex];
      const success = await setRiddle(newQuestion, answer);
      if (!success) throw new Error("Set riddle tx failed");
      // If success, update activeRiddle state
      setActiveRiddle(newQuestion);
    } catch (error) {
      console.error("getActiveRiddle ERROR:", error);
    } finally {
      setLoadingRiddle(false);
    }
  };

  // Run `getActiveRiddle` only once on mount
  useEffect(() => {
    if (!hasFetchedRiddle.current) {
      hasFetchedRiddle.current = true;
      getActiveRiddle();
    }
  }, [getActiveRiddle]);

  const getWinner = async (): Promise<string> => {
    try {
      return await readContract(config, {
        address: RIDDLR_CONTRACT as `0x${string}`,
        abi: RiddlrAbi,
        chainId: 11155111,
        functionName: "winner",
      });
    } catch (error) {
      console.error("getWinner ERROR:", error);
      return ZeroAddress;
    }
  };

  // submitAnswer tx hook
  const {
    isPending: submitAnswerIsPending,
    executeTransaction: executeSubmitAnswerTransaction,
  } = useContractTransaction({
    abi: RiddlrAbi,
    contractAddress: CONSTANTS.RIDDLR_CONTRACT as `0x${string}`,
    functionName: "submitAnswer",
    args: [userAnswer.toLowerCase()],
    onSuccess: async () => {
      // Reset input
      setUserAnswer("");
      // Check answer by fetching isActive
      const winner = await getWinner();
      // If isActive is false, bot sets new riddle
      if (compareEthereumAddresses(connectedAddress, winner)) {
        window.alert("Congratulations! That was the correct answer");
        return await getActiveRiddle();
      } else {
        window.alert("Wrong answer, try again");
      }
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
        disabled={submitAnswerIsPending || loadingRiddle || !userAnswer.length}
        onClickAction={executeSubmitAnswerTransaction}
        loading={submitAnswerIsPending}
        errorMessage={txError}
      >
        SUBMIT ANSWER
      </TransactionButton>
    );
  };

  return (
    <Fragment>
      <div className="py-12 justify-items-center">
        <div className="max-w-lg text-center space-y-6 border-primary border-2 rounded-md p-6 glass-bg">
          <p className="rounded-md w-full border-primary border-2 font-bold font-nimbus text-primary py-2 px-4">
            {loadingRiddle
              ? "Loading riddle..."
              : noActiveRiddle
              ? "There is no active riddle. Please check back later."
              : activeRiddle}
          </p>
          <TextField
            value={userAnswer}
            onChangeValue={(value) => setUserAnswer(value)}
          />
          {transactionButton()}
        </div>
      </div>
      <ConnectWalletModal
        open={connectWalletModalOpen}
        onClose={() => setConnectWalletModalOpen(false)}
      />
    </Fragment>
  );
}

export default App;
