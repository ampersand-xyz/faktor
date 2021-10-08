import React, { createContext, RefObject, useCallback, useContext, useState } from 'react';
import { FormFieldProps } from './FormField';

export interface IFormContext {
  formRef: React.RefObject<HTMLFormElement | null>;
  fields: FormFieldProps[];
  fieldValues: Array<{ id: string; value: string }>;
  setFieldValue: (id: string, value: string) => void;
}

export const FormContext = createContext<IFormContext | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) throw new Error();
  return context;
};

export interface FormProviderProps {
  fields: FormFieldProps[];
  formRef: RefObject<HTMLFormElement | null>;
}

export const FormProvider: React.FC<FormProviderProps> = ({
  children,
  formRef: initialFormRef,
  fields: initialFields
}) => {
  const [formRef] = useState<React.RefObject<HTMLFormElement | null>>(initialFormRef);
  const [fields] = useState<FormFieldProps[]>(initialFields);
  const [fieldValues, setFieldValues] = useState<Array<{ id: string; value: string }>>(
    initialFields.map((item) => ({ id: item.id, value: '' }))
  );

  const setFieldValue = useCallback(
    (id: string, value: string) => {
      setFieldValues((prev) => {
        const index = prev.findIndex((item) => item.id === id);
        if (index >= 0) {
          const newList = [...prev.slice(0, index), { id, value }, ...prev.slice(index + 1)];

          return newList;
        }
        throw new Error(`could not find item with id ${id}`);
      });
    },
    [setFieldValues]
  );

  return (
    <FormContext.Provider value={{ formRef, fields, fieldValues, setFieldValue }}>
      {children}
    </FormContext.Provider>
  );
};
