export interface InputFieldProps {
  type?: string;
  value?: string;
  onChange?: (val: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
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
  error,
  labelClassName="",
  inputClassName="",
  autoComplete="off",
}) => {



  const _onChange=(e) => {
    onChange(e.target.value);
  };

  return (
    <div className={`flex flex-col leading-tight`}>
      {label&&<label className={`text-gray-500 font-medium mb-2 ${labelClassName}`}>{label}</label>}
      <input
        {...{value,placeholder,autoComplete,type}}
        className={`h-12 text-lg w-full text-black placeholder-gray-400 bg-white border ${error? 'border-red-600':`border-gray-100`} rounded-md px-3 py-2 ${inputClassName}`}
        onChange={_onChange}
        required
      />
      {error&&<p className="text-red-600 text-base">{error}</p>}
    </div>
  );
};
