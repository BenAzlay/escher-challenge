import { abbreviateAmount, numberWithCommas } from "@/utils/utilFunc";
import { FC } from "react";
import Tooltip from "./Tooltip";
import LoadingText from "./LoadingText";
import Image from "next/image";

interface TokenAmountFieldProps {
  amount: string;
  onChangeAmount: (amount: string) => void;
  showTokenBalance: boolean;
  tokenBalance?: string;
  balanceLabel?: string;
  placeholder?: string;
  tokenPrice?: number; // Optional: Token price for $ value calculation
  balanceIsLoading?: boolean;
  error?: string | null;
}

const TokenAmountField: FC<TokenAmountFieldProps> = ({
  amount,
  onChangeAmount,
  showTokenBalance = true,
  tokenBalance = "0",
  balanceLabel = "Balance",
  placeholder = "Amount",
  tokenPrice = 1, // Default token price, replace with actual value
  balanceIsLoading = false,
  error = null,
}) => {
  const usdValue = parseFloat(amount || "0") * tokenPrice;

  // Validate and handle input change
  const handleInputChange = (value: string) => {
    // Allow only numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      onChangeAmount(value);
    }
  };

  return (
    <div
      title={!!error ? error : undefined}
      className={`rounded-md border bg-[#1e1e1e] px-2 sm:px-4 py-3 w-full ${
        !!error ? "border-error" : "border-[#333333]"
      }`}
    >
      <div className="flex items-center">
        <input
          value={amount}
          onChange={(event) => handleInputChange(event.target.value)}
          type="text"
          placeholder={placeholder}
          className="bg-transparent w-full text-white text-lg placeholder-gray-500 focus:outline-none"
        />
        <div className="inline-flex gap-2 items-center shrink-0">
          <Image src={"/tokenLogos/ETH.png"} alt="ETH" height={20} width={20} />
          <span className="p-0 font-bold">ETH</span>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2 text-sm text-gray-400 gap-2">
        <div className="text-left text-ellipsis overflow-hidden">
          <Tooltip message={`$${numberWithCommas(usdValue)}`}>
            {abbreviateAmount(usdValue, "$", 2)}
          </Tooltip>
          <span></span>
        </div>
        {showTokenBalance && (
          <div
            className="cursor-pointer text-right whitespace-nowrap hover:underline"
            onClick={() => onChangeAmount(tokenBalance)}
          >
            <p>
              {balanceLabel}:{" "}
              {!balanceIsLoading ? (
                abbreviateAmount(tokenBalance, "", 3)
              ) : (
                <LoadingText />
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenAmountField;
