import React, { ReactNode, useMemo, useRef } from 'react';
import { FormProvider, useFormContext } from './FormContext';
import { FormFieldProps } from './FormField';
import { getFieldError } from './utils';

export interface FormProps {
  fields: FormFieldProps[];
  onSubmit: (values: Record<string, string>) => void;
  children: ReactNode;
  className?: string;
}

export function Form({ children, onSubmit, className = '', fields }: FormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);

  return (
    <FormProvider {...{ formRef, fields }}>
      <FormCore className={className} onSubmit={onSubmit}>
        {children}
      </FormCore>
    </FormProvider>
  );
}

export const FormCore: React.FC<{
  className: string;
  onSubmit: (values: Record<string, string>) => void;
}> = ({ children, className, onSubmit }) => {
  const { formRef, fieldValues } = useFormContext();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formIsValid = Object.entries(fieldValues).every(
      ([fieldKey, fieldValue]) => !getFieldError(fieldKey, fieldValue)
    );
    if (formIsValid) {
      onSubmit(fieldValues);
    }
  };

  return (
    <form ref={(ref) => (formRef.current = ref)} className={className} onSubmit={handleSubmit}>
      {children}
    </form>
  );
};

Form.Title = function FormTitle({ children }: { children: ReactNode }) {
  return <h2 className="font-semibold text-2xl">{children}</h2>;
};

Form.Fields = function FormFields({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return <ul className={`flex flex-col gap-3 flex-grow ${className} my-2`}>{children}</ul>;
};

Form.Actions = function FormActions({
  children
}: {
  children: (props: { submitDisabled: boolean }) => JSX.Element;
}) {
  const { fieldValues } = useFormContext();

  const submitDisabled = useMemo(() => {
    const list = Object.entries(fieldValues);
    return list.length === 0 || list.some(([id, value]) => getFieldError(id, value));
  }, [fieldValues]);

  return <div>{children({ submitDisabled })}</div>;
};
