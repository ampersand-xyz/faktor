import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import React from "react";
import { PayInvoiceRequest } from "src/api/payInvoice";
import { abbreviate } from "src/utils";
import { PrimaryAction, SecondaryAction } from "../ActionButtons";

interface ConfirmationFormProps {
  request: PayInvoiceRequest;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmationForm: React.FC<ConfirmationFormProps> = ({
  request,
  onCancel,
  onConfirm,
}) => {
  return (
    <form onSubmit={onConfirm} className="w-full">
      <h1 className="text-modal-title">Pay invoice</h1>
      <div className="flex flex-col mt-8 space-y-4">
        <Section>
          <Label>From</Label>
          <Value>{abbreviate(request.invoice.account.creditor)}</Value>
        </Section>
        <Section>
          <Label>Balance</Label>
          <Value>
            {request.invoice.account.balance / LAMPORTS_PER_SOL} SOL
          </Value>
        </Section>
        <Section>
          <Label>Memo</Label>
          <Value>{request.invoice.account.memo}</Value>
        </Section>
      </div>
      <div className="flex items-center justify-between w-full mt-8 space-x-3">
        <SecondaryAction className="w-1/2" onClick={onCancel}>
          Cancel
        </SecondaryAction>
        <PrimaryAction className="w-1/2" onClick={onConfirm}>
          Pay
        </PrimaryAction>
      </div>
    </form>
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
  return <span className="mb-2 font-medium text-gray-500">{children}</span>;
};

export const Value: React.FC = ({ children }) => {
  return (
    <span className="text-lg font-semibold text-gray-800">{children}</span>
  );
};
