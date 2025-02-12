import { FC, ReactNode } from "react";

interface TextFieldProps {
  value: string;
  onChangeValue: (value: string) => void;
}

const TextField: FC<TextFieldProps> = ({
  value,
  onChangeValue,
}) => {
  // Validate and handle input change
  const handleInputChange = (value: string) => {
    onChangeValue(value);
  };

  return (
    <div className="rounded-md border border-[#333333] bg-[#1e1e1e] px-2 sm:px-4 py-3 w-full">
      <input
        value={value}
        onChange={(event) => handleInputChange(event.target.value)}
        type="text"
        placeholder={"Forty-two"}
        className="bg-transparent w-full text-white text-lg placeholder-gray-500 focus:outline-none"
      />
    </div>
  );
};

export default TextField;
