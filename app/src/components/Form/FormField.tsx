import { useCallback, useState } from 'react';
import { useFormContext } from './FormContext';
import { getFieldError } from './getFieldError';

export interface FormFieldProps extends React.HTMLAttributes<HTMLInputElement> {
  id: string;
  type?: string;
  label?: string;
  placeholder?: string;
  labelClassName?: string;
  inputClassName?: string;
  autoComplete?: string;
  min?: string;
  step?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  type = 'text',
  label,
  placeholder,
  labelClassName = '',
  inputClassName = 'h-12 text-lg w-full text-white placeholder-gray-600 bg-gray-900 rounded-md px-3 py-2',
  min = '0.0',
  step = '0.000000001',
  autoComplete = 'off',
  ...props
}) => {
  const { fieldValues, setFieldValue, wasSubmitted } = useFormContext();
  const [value, setValue] = useState(fieldValues[id]);

  const handleChange = useCallback(
    ({ currentTarget: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      setValue(value);
      setFieldValue(id, value);
    },
    [id, setFieldValue]
  );

  const errorMessage = getFieldError(id, value);

  const displayErrorMessage = wasSubmitted && errorMessage;

  return (
    <div className={`flex flex-col ${displayErrorMessage ? 'gap-2' : ''}`}>
      {label && (
        <>
          <label className={labelClassName} htmlFor={id}>
            {label}
          </label>
          <br />
        </>
      )}

      <input
        {...{ id, value, placeholder, autoComplete, min, type, step }}
        {...props}
        className={`${inputClassName} ${
          displayErrorMessage ? 'border border-red-600' : 'border border-gray-700'
        }`}
        onChange={handleChange}
        required
      />
      {displayErrorMessage ? (
        <span role="alert" className="text-red-600 text-sm ">
          {errorMessage}
        </span>
      ) : null}
    </div>
  );
};
