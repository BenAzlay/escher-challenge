import { FC, ReactNode } from "react";
import Tooltip from "./Tooltip";

interface TextFieldProps {
  value: string;
  onChangeValue: (value: string) => void;
  error?: string | null;
}

const TextField: FC<TextFieldProps> = ({
  value,
  onChangeValue,
  error = null,
}) => {
  // Validate and handle input change
  const handleInputChange = (value: string) => {
    onChangeValue(value);
  };

  return (
      <div
        title={error ? error : undefined}
        className={`rounded-md bg-[#1e1e1e] px-2 sm:px-4 py-3 w-full border ${
          !!error ? "border-error" : "border-[#333333]"
        }`}
      >
        <input
          value={value}
          onChange={(event) => handleInputChange(event.target.value)}
          type="text"
          placeholder={"0x123..."}
          className="bg-transparent w-full text-white text-lg placeholder-gray-500 focus:outline-none"
        />
      </div>
  );
};

export default TextField;
