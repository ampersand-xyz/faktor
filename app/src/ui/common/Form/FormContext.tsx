import React, { createContext, RefObject, useCallback, useContext, useState } from 'react';
import { FormFieldProps } from './FormField';

export interface IFormContext {
  formRef: React.MutableRefObject<HTMLFormElement | null>;
  fields: FormFieldProps[];
  fieldValues: Record<string, string>;
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
  initialValues: Record<string, string>;
  formRef: RefObject<HTMLFormElement | null>;
}

export const FormProvider: React.FC<FormProviderProps> = ({
  children,
  initialValues,
  formRef: initialFormRef,
  fields: initialFields
}) => {
  const [formRef] = useState<React.RefObject<HTMLFormElement | null>>(initialFormRef);
  const [fields] = useState<FormFieldProps[]>(initialFields);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(initialValues);

  const setFieldValue = useCallback(
    (id: string, value: string) => {
      setFieldValues((prev) => ({ ...prev, [id]: value }));
    },
    [setFieldValues]
  );

  return (
    <FormContext.Provider value={{ formRef, fields, fieldValues, setFieldValue }}>
      {children}
    </FormContext.Provider>
  );
};
