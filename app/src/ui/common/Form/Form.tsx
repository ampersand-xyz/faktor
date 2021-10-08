import React, { ReactNode, useMemo, useRef } from 'react';
import { FormProvider, useFormContext } from './FormContext';
import { FormFieldProps } from './FormField';
import { getFieldError, isTextFormData } from './utils';

export interface FormProps {
  fields: FormFieldProps[];
  onSubmit: (values: Record<string, string>) => void;
  children: ReactNode;
  className?: string;
}

export function Form({ children, onSubmit, className = '', fields }: FormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (!isTextFormData(formData)) throw new Error();
    const fieldValues = Object.fromEntries(formData.entries());
    const formIsValid = Object.entries(fieldValues).every(
      ([fieldKey, fieldValue]) => !getFieldError(fieldKey, fieldValue)
    );
    if (formIsValid) {
      onSubmit(fieldValues);
    }
  };

  const formRef = useRef<HTMLFormElement | null>(null);

  return (
    <FormProvider {...{ formRef, fields }}>
      <form ref={formRef} className={className} onSubmit={handleSubmit}>
        {children}
      </form>
    </FormProvider>
  );
}

Form.Fields = function FormFields({ children }: { children: ReactNode }) {
  return <ul>{children}</ul>;
};

Form.Actions = function FormActions({
  children
}: {
  children: (props: { submitDisabled: boolean }) => JSX.Element;
}) {
  const { fieldValues } = useFormContext();

  const submitDisabled = useMemo(() => {
    return (
      fieldValues.length === 0 || fieldValues.some(({ id, value }) => getFieldError(id, value))
    );
  }, [fieldValues]);

  return <div>{children({ submitDisabled })}</div>;
};
