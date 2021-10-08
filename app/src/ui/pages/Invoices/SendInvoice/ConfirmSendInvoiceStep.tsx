import { InvoiceData } from './shared';

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
    <div>
      <h2>Confirm Send</h2>
      <div>{JSON.stringify(data)}</div>
      <div className="flex items-center gap-3 mt-12">
        <button
          onClick={onGoBack}
          className="h-12 flex items-center justify-center w-1/2 bg-gray-700 rounded-lg font-bold text-lg"
        >
          Back
        </button>
        <button
          onClick={onConfirm}
          className="h-12 flex items-center justify-center w-1/2 bg-indigo-600 rounded-lg font-bold text-lg disabled:bg-gray-700 text-white disabled:bg-opacity-80 disabled:text-opacity-50 disabled:cursor-default"
        >
          Send
        </button>
      </div>
    </div>
  );
};
