import { useCallback, useState } from 'react';
import { useFormContext } from './FormContext';

export interface FormFieldProps {
  id: string;
  type?: string;
  label?: string;
  placeholder?: string;
  labelClassName?: string;
  inputClassName?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  type = 'text',
  label,
  placeholder,
  labelClassName = '',
  inputClassName = ''
}) => {
  const { fieldValues, setFieldValue } = useFormContext();
  const [value, setValue] = useState(fieldValues[id]);

  const handleChange = useCallback(
    ({ currentTarget: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      setValue(value);
      setFieldValue(id, value);
    },
    [id, setFieldValue]
  );

  return (
    <div>
      {label && (
        <>
          <label className={labelClassName} htmlFor={id}>
            {label}
          </label>
          <br />
        </>
      )}

      <input
        className={`${inputClassName}`}
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};
