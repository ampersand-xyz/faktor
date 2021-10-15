import { useEffect, useMemo, useState } from "react";
import { SecondaryAction, PrimaryAction } from "../ActionButtons";
import { IssueInvoiceRequest } from "src/api";
import { InputField } from "../InputField";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { PublicKey } from "@solana/web3.js";

export interface EditingStepProps {
  request: IssueInvoiceRequest;
  onCancel: () => void;
  onSubmit: (request: IssueInvoiceRequest) => void;
}

export const EditingStep: React.FC<EditingStepProps> = ({
  request,
  onCancel,
  onSubmit,
}) => {
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  const [debtor, setDebtor] = useState(request.debtor?.toString() ?? "");
  const [balance, setBalance] = useState(request.balance?.toString() ?? "");
  const [memo, setMemo] = useState(request.memo?.toString() ?? "");

  const _onSubmit = () => {
    onSubmit({
      debtor: new PublicKey(debtor),
      balance: parseInt(balance),
      memo: memo,
    });
  };

  useEffect(() => {
    // TODO input validation (valid address, non-negative balance, etc.)
    setIsSubmitEnabled(debtor !== "" && balance !== "" && memo !== "");
  }, [debtor, balance, memo]);

  return (
    <form onSubmit={_onSubmit} className="w-full">
      <h1 className="text-3xl font-semibold text-black">New invoice</h1>
      <div className="flex flex-col mt-8 space-y-4">
        <InputField
          type="text"
          label="Debtor"
          placeholder="Public key"
          value={debtor}
          onChange={(v) => setDebtor(v)}
        />
        <InputField
          type="number"
          label="Balance (SOL)"
          placeholder="10"
          value={balance}
          onChange={(v) => setBalance(v)}
        />
        <InputField
          type="text"
          label="Memo"
          placeholder="For dinner"
          value={memo}
          onChange={(v) => setMemo(v)}
        />
      </div>
      <div className="flex items-center justify-between w-full mt-8 space-x-3">
        <SecondaryAction className="w-1/2" onClick={onCancel}>
          Cancel
        </SecondaryAction>
        <PrimaryAction
          className="w-1/2"
          disabled={!isSubmitEnabled}
          onClick={_onSubmit}
        >
          Send
        </PrimaryAction>
      </div>
    </form>
  );
};
