import { Form, FormField, FormFieldProps } from '@ui/common';
import { useMemo } from 'react';
import { InvoiceData } from './shared';

const inputFields: FormFieldProps[] = [
  {
    id: 'recipient',
    placeholder: "Recipient's SOL address"
  },
  { id: 'amount', placeholder: 'Amount (SOL)', type: 'number' }
];

export interface AmountAndRecipientStepProps {
  initialData: InvoiceData;
  onConfirm: (data: InvoiceData) => void;
  onCancel: () => void;
}

export const AmountAndRecipientStep: React.FC<AmountAndRecipientStepProps> = ({
  initialData,
  onConfirm,
  onCancel
}) => {
  const initialValues = useMemo(
    () => ({
      ...initialData,
      amount: initialData.amount > 0 ? initialData.amount.toString() : ''
    }),
    [initialData]
  );

  const handleSubmit = (fieldValues: Record<string, string>) => {
    const data: InvoiceData = {
      recipient: fieldValues['recipient'],
      amount: parseInt(fieldValues['amount'])
    };
    onConfirm(data);
  };

  return (
    <Form
      initialValues={initialValues}
      fields={inputFields}
      onSubmit={handleSubmit}
      className="flex flex-col z-10 relative mx-0 my-auto overflow-x-hidden overflow-y-auto max-h-full px-4 py-5 w-full list-none"
    >
      <Form.Title>Send Invoice</Form.Title>
      <Form.Fields className="mt-10">
        {inputFields.map((props) => (
          <li key={props.id}>
            <FormField
              {...props}
              inputClassName="h-12 text-lg w-full text-white placeholder-white placeholder-opacity-40 bg-gray-800 rounded-md border border-gray-700 px-3 py-2"
            />
          </li>
        ))}
      </Form.Fields>
      <Form.Actions>
        {({ submitDisabled }) => (
          <div className="flex items-center gap-3 mt-12">
            <button
              onClick={onCancel}
              className="h-12 flex items-center justify-center w-1/2 bg-gray-700 rounded-lg font-bold text-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitDisabled}
              className="h-12 flex items-center justify-center w-1/2 bg-indigo-600 rounded-lg font-bold text-lg disabled:bg-gray-700 text-white disabled:bg-opacity-80 disabled:text-opacity-50 disabled:cursor-default"
            >
              Send
            </button>
          </div>
        )}
      </Form.Actions>
    </Form>
  );
};
