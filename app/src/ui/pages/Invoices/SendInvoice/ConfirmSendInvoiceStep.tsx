import { InvoiceData } from './shared';

export interface ConfirmSendInvoiceStepProps {
  data: InvoiceData;
  onConfirm: () => void;
}

export const ConfirmSendInvoiceStep: React.FC<ConfirmSendInvoiceStepProps> = ({
  data,
  onConfirm
}) => {
  return (
    <div>
      <h2>Confirm Send</h2>
      <div>{JSON.stringify(data)}</div>
      <button
        onClick={onConfirm}
        className="h-12 flex items-center justify-center w-1/2 bg-indigo-600 rounded-lg font-bold text-lg disabled:bg-gray-700 text-white disabled:bg-opacity-80 disabled:text-opacity-50 disabled:cursor-default"
      >
        Send
      </button>
    </div>
  );
};
