import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { abi as RiddlrAbi } from "@/abi/RiddlrAbi";
import CONSTANTS from "@/utils/constants";

const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
const INFURA_RPC_URL = process.env.INFURA_RPC_URL as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { riddle, answerHash } = req.body;
    if (!riddle || !answerHash) {
      return res.status(400).json({ error: "Missing riddle or answerHash" });
    }

    // Connect to Sepolia using Infura
    const provider = new ethers.JsonRpcProvider(INFURA_RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(
      CONSTANTS.RIDDLR_CONTRACT,
      RiddlrAbi,
      wallet
    );

    // Fetch the current nonce
    const nonce = await provider.getTransactionCount(wallet.address, "latest");

    // Fetch recommended gas settings
    const feeData = await provider.getFeeData();
    const gasLimit = await contract.setRiddle.estimateGas(riddle, answerHash);

    // Send the transaction manually
    const tx = await contract.setRiddle(riddle, answerHash, {
      gasLimit,
      maxFeePerGas: feeData.maxFeePerGas ?? undefined,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ?? undefined,
      nonce, // Ensure unique nonce
    });

    await tx.wait(); // Wait for confirmation

    return res.status(200).json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error("Error setting riddle:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error });
  }
}
