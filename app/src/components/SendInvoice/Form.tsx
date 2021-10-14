import React, { useMemo, useRef } from 'react';
import { FormField } from './FormField';
import { FormProvider, useFormContext } from './FormContext';
import { getFieldError } from './getFieldError';

export interface FormProps {
  initialValues?: Record<string, string>;
  onSubmit: (values: Record<string, string>) => void;
  children: (props: { submitDisabled: boolean }) => JSX.Element;
  className?: string;
}

export function Form({
  children,
  initialValues: _initialValues,
  onSubmit,
  className = ''
}: FormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const initialValues = useMemo(() => _initialValues ?? {}, [_initialValues]);

  return (
    <FormProvider {...{ formRef, initialValues }}>
      <FormCore className={className} onSubmit={onSubmit} children={children} />
    </FormProvider>
  );
}

export const FormCore = ({
  children,
  className,
  onSubmit
}: {
  className: string;
  children: (props: { submitDisabled: boolean }) => JSX.Element;
  onSubmit: (values: Record<string, string>) => void;
}) => {
  const { formRef, fieldValues, setWasSubmitted } = useFormContext();

  const submitDisabled = useMemo(() => {
    const list = Object.entries(fieldValues);
    return list.length === 0 || list.some(([id, value]) => getFieldError(id, value));
  }, [fieldValues]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formIsValid = Object.entries(fieldValues).every(
      ([fieldKey, fieldValue]) => !getFieldError(fieldKey, fieldValue)
    );
    setWasSubmitted(true);
    if (formIsValid) {
      onSubmit(fieldValues);
    }
  };

  return (
    <form
      ref={(ref) => (formRef.current = ref)}
      className={`flex flex-col ${className}`}
      onSubmit={handleSubmit}
    >
      {children({ submitDisabled })}
    </form>
  );
};

Form.Field = FormField;
