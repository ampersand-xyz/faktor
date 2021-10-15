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
    <div className="w-full">
      <h1 className="text-3xl font-semibold text-black">Confirm invoice</h1>
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
    <div className="flex flex-col justify-center bg-gray-700 bg-opacity-40 rounded-md px-4 py-3 w-full space-y-0.5">
      {children}
    </div>
  );
};

export const Label: React.FC = ({ children }) => {
  return <span className="text-sm text-gray-400">{children}</span>;
};

export const Value: React.FC = ({ children }) => {
  return <span className="text-lg font-semibold">{children}</span>;
};
