import React, {
  createContext,
  RefObject,
  SetStateAction,
  useCallback,
  useContext,
  useState
} from 'react';

export interface IFormContext {
  formRef: React.MutableRefObject<HTMLFormElement | null>;
  fieldValues: Record<string, string>;
  setFieldValue: (id: string, value: string) => void;
  wasSubmitted: boolean;
  setWasSubmitted: React.Dispatch<SetStateAction<boolean>>;
}

export const FormContext = createContext<IFormContext | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) throw new Error();
  return context;
};

export interface FormProviderProps {
  initialValues: Record<string, string>;
  formRef: RefObject<HTMLFormElement | null>;
}

export const FormProvider: React.FC<FormProviderProps> = ({
  children,
  initialValues,
  formRef: initialFormRef
}) => {
  const [formRef] = useState<React.RefObject<HTMLFormElement | null>>(initialFormRef);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(initialValues);
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const setFieldValue = useCallback(
    (id: string, value: string) => {
      setFieldValues((prev) => ({ ...prev, [id]: value }));
    },
    [setFieldValues]
  );

  return (
    <FormContext.Provider
      value={{ formRef, fieldValues, setFieldValue, wasSubmitted, setWasSubmitted }}
    >
      {children}
    </FormContext.Provider>
  );
};
