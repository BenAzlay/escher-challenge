import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=30&interval=daily"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch historical ETH data");
    }

    const data = await response.json();

    // Format data for TradingView (timestamps in seconds)
    const formattedData = data.prices.map((entry: [number, number]) => ({
      time: entry[0] / 1000, // Convert ms to seconds
      value: entry[1], // ETH price
    }));

    return res.status(200).json(formattedData);
  } catch (error: any) {
    console.error("Error fetching ETH historical data:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
