import {useEffect,useState} from "react";
import {SecondaryAction,PrimaryAction} from "../ActionButtons";
import {checkWalletAddressExists, IssueInvoiceRequest} from "src/api";
import {InputField} from "../InputField";
import {PublicKey} from "@solana/web3.js";
import {useConnection} from "@solana/wallet-adapter-react";

export interface EditingStepProps {
  request: IssueInvoiceRequest;
  onCancel: () => void;
  onSubmit: (request: IssueInvoiceRequest) => void;
}

export const EditingStep: React.FC<EditingStepProps>=({
  request,
  onCancel,
  onSubmit,
}) => {
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  const [debtor, setDebtor] = useState(request.debtor?.toString()??"");
  const [debtorError, setDebtorError] = useState('');

  const [balance, setBalance] = useState(request.balance?.toString()??"");
  const [memo, setMemo] = useState(request.memo?.toString()??"");

  const { connection } = useConnection()

  const _onSubmit=() => {
    onSubmit({
      debtor: new PublicKey(debtor),
      balance: parseInt(balance),
      memo: memo,
    });
  };

  useEffect(() => {
    // TODO input validation (valid address, non-negative balance, etc.)
    setIsSubmitEnabled(debtor!==""&&balance!==""&&memo!=="");
  } , [debtor,balance,memo]);

  useEffect(() => {
    if (debtor) {
      setDebtorError('')
      checkWalletAddressExists(connection,debtor).then((res) => {
        if(!res) {
          setDebtorError('Not a valid SOL address.')
        }
      })
    }
  } , [debtor])

  return (
    <form onSubmit={_onSubmit} className="w-full">
      <h1 className="text-modal-title">New invoice</h1>
      <div className="flex flex-col mt-8 space-y-4">
        <InputField
          type="text"
          placeholder="Debtor's SOL Address"
          error={debtorError}
          value={debtor}
          onChange={(v) => setDebtor(v)}
        />
        <InputField
          type="number"
          placeholder="Balance (SOL)"
          onChange={(v) => setBalance(v)}
        />
        <InputField
          type="text"
          placeholder="Add note"
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
