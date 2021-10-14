import { useMemo } from 'react';
import {InvoiceData} from 'src/types';
import {FormFieldProps,Form} from '../Form';
import {SecondaryAction,PrimaryAction} from '../ActionButtons';
import {Card} from '../Card';
import {List} from '../List';

export const SOL_PRECISION_STEP = '0.000000001';

const inputFields: FormFieldProps[] = [
  {
    id: 'debtor',
    placeholder: "Recipient's SOL address"
  },
  {
    id: 'amount',
    placeholder: 'Amount (SOL)',
    type: 'number',
    step: SOL_PRECISION_STEP,
    min: SOL_PRECISION_STEP
  },
  { id: 'memo', placeholder: "What's this for?" }
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
      amount: initialData.amount > 0 ? initialData.amount.toPrecision() : ''
    }),
    [initialData]
  );

  const handleSubmit = (fieldValues: Record<string, string>) => {
    const data: InvoiceData = {
      debtor: fieldValues['debtor'],
      amount: parseFloat(fieldValues['amount']),
      memo: fieldValues['memo']
    };
    onConfirm(data);
  };

  return (
    <Form initialValues={initialValues} onSubmit={handleSubmit}>
      {({ submitDisabled }) => (
        <Card className="shadow-lg bg-gray-800 h-[28rem]">
          <Card.Header>
            <h2>Send Invoice</h2>
          </Card.Header>
          <Card.Body>
            <List>
              {inputFields.map((props) => (
                <li key={props.id}>
                  <Form.Field {...props} />
                </li>
              ))}
            </List>
          </Card.Body>
          <Card.Footer>
            <SecondaryAction className="w-1/2" onClick={onCancel}>
              Cancel
            </SecondaryAction>
            <PrimaryAction className="w-1/2" type="submit" disabled={submitDisabled}>
              Send
            </PrimaryAction>
          </Card.Footer>
        </Card>
      )}
    </Form>
  );
};
