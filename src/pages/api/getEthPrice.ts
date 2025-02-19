import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch ETH price");
    }

    const data = await response.json();
    return res.status(200).json({ price: data.ethereum.usd });
  } catch (error: any) {
    console.error("Error fetching ETH price:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
