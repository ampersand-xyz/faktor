import { IssueInvoiceRequest } from "src/api";
import { SecondaryAction, PrimaryAction } from "../ActionButtons";

export interface ConfirmationStepProps {
  request: IssueInvoiceRequest;
  onBack: () => void;
  onConfirm: () => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  request,
  onBack,
  onConfirm,
}) => {
  return (
    <div className="w-full bg-gray-50">
      <h1 className="text-modal-title">Confirm invoice</h1>
      <div className="flex flex-col mt-8 space-y-4">
        <Section>
          <Label>Debtor</Label>
          <Value>{request.debtor.toString()}</Value>
        </Section>
        <Section>
          <Label>Balance</Label>
          <Value>{request.balance} SOL</Value>
        </Section>
        <Section>
          <Label>Memo</Label>
          <Value>{request.memo}</Value>
        </Section>
      </div>
      <div className="flex items-center justify-between w-full mt-8 space-x-3">
        <SecondaryAction className="w-1/2" onClick={onBack}>
          Back
        </SecondaryAction>
        <PrimaryAction className="w-1/2" onClick={onConfirm}>
          Confirm
        </PrimaryAction>
      </div>
    </div>
  );
};

export const Section: React.FC = ({ children }) => {
  return (
    <div className="flex flex-col justify-center border border-gray-200 rounded-md px-3 py-2 w-full space-y-0.5">
      {children}
    </div>
  );
};

export const Label: React.FC = ({ children }) => {
  return <span className="text-gray-500 font-medium mb-2">{children}</span>;
};

export const Value: React.FC = ({ children }) => {
  return <span className="text-lg text-gray-800 font-semibold">{children}</span>;
};
