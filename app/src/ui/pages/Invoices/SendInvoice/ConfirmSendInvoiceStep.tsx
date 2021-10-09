import { InvoiceData } from '@core/invoice/types';
import { Card, SolanaLogo } from '@ui/common';
import { PrimaryAction, SecondaryAction } from '@ui/common';

export interface ConfirmSendInvoiceStepProps {
  data: InvoiceData;
  onGoBack: () => void;
  onConfirm: () => void;
}

export const ConfirmSendInvoiceStep: React.FC<ConfirmSendInvoiceStepProps> = ({
  data,
  onConfirm,
  onGoBack
}) => {
  return (
    <Card className="shadow-lg bg-gray-800 h-card w-card">
      <Card.Header>
        <h2>Confirm Invoice</h2>
      </Card.Header>
      <Card.Body>
        <div className="flex flex-col items-center space-y-3">
          <Section>
            <Label>Send to</Label>
            <Value>{data.debtor}</Value>
          </Section>
          <Section>
            <Label>Amount</Label>
            <div className="text-xl flex items-center justify-between w-full">
              <Value>{data.amount.toPrecision()}</Value>
              <div className="flex items-center space-x-2">
                <SolanaLogo size={5} />
                <span className="font-semibold">SOL</span>
              </div>
            </div>
          </Section>
          <Section>
            <Label>Memo</Label>
            <Value>{data.memo}</Value>
          </Section>
        </div>
      </Card.Body>
      <Card.Footer>
        <SecondaryAction className="w-1/2" onClick={onGoBack}>
          Back
        </SecondaryAction>
        <PrimaryAction className="w-1/2" onClick={onConfirm}>
          Send
        </PrimaryAction>
      </Card.Footer>
    </Card>
  );
};

export const Section: React.FC = ({ children }) => {
  return (
    <div className="flex flex-col justify-center bg-gray-700 bg-opacity-40 rounded-md px-4 py-3 w-full space-y-0.5 overflow-hidden">
      {children}
    </div>
  );
};

export const Label: React.FC = ({ children }) => {
  return <span className="text-gray-400 text-sm">{children}</span>;
};

export const Value: React.FC = ({ children }) => {
  return (
    <span className="font-semibold text-lg overflow-ellipsis overflow-x-hidden">{children}</span>
  );
};

export const SendArrowIcon = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M4.01 6.03l7.51 3.22-7.52-1 .01-2.22m7.5 8.72L4 17.97v-2.22l7.51-1M2.01 3L2 10l15 2-15 2 .01 7L23 12 2.01 3z" />
      </svg>
    </>
  );
};

export const DownArrowIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
};
