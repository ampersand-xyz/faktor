import {FormEventHandler} from "react";

export interface InputFieldProps
  extends React.HTMLAttributes<HTMLInputElement> {
  type?: string;
  value?: string;
  onChange?: (string) => void;
  label?: string;
  placeholder?: string;
  labelClassName?: string;
  inputClassName?: string;
  autoComplete?: string;
  min?: string;
  step?: string;
}

export const InputField: React.FC<InputFieldProps>=({
  value,
  onChange,
  type="text",
  label,
  placeholder,
  labelClassName="",
  inputClassName="",
  autoComplete="off",
}) => {
  const _onChange=(e) => {
    onChange(e.target.value);
  };

  return (
    <div className={`flex flex-col`}>
      {label&&<label className={`text-gray-500 font-medium mb-2 ${labelClassName}`}>{label}</label>}
      <input
        {...{value,placeholder,autoComplete,type}}
        className={`h-12 text-lg w-full text-black placeholder-gray-400 border border-gray-200 rounded-md px-3 py-2 ${inputClassName}`}
        onChange={_onChange}
        required
      />
    </div>
  );
};
