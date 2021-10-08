import { Modal } from '@ui/common';
import { useState } from 'react';
import { AmountAndRecipientStep } from './AmountAndRecipientStep';
import { ConfirmSendInvoiceStep } from './ConfirmSendInvoiceStep';
import { InvoiceData } from './shared';

export enum SendInvoiceSteps {
  ChooseRecipientAndAmount = 0,
  ConfirmSend = 1
}

const initialData = { recipient: '', amount: -1 };

export const SendInvoice = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState<InvoiceData>(initialData);
  const [step, setStep] = useState(SendInvoiceSteps.ChooseRecipientAndAmount);

  const closeModal = () => {
    setData(initialData);
    setStep(SendInvoiceSteps.ChooseRecipientAndAmount);
    setModalOpen(false);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const confirmSendInvoice = () => {
    console.log('Confirmed invoice to send: ', JSON.stringify(data));
  };

  return (
    <>
      <button
        onClick={openModal}
        className="flex items-center justify-center px-4 font-semibold h-11 bg-blue-500 hover:bg-blue-700 rounded-lg"
      >
        Send Invoice
      </button>
      <Modal className="bg-gray-800 bg-opacity-90 max-w-sm" open={modalOpen} onClose={closeModal}>
        {step === SendInvoiceSteps.ChooseRecipientAndAmount ? (
          <AmountAndRecipientStep
            initialData={data}
            onCancel={closeModal}
            onConfirm={(_data) => {
              setData(_data);
              setStep(SendInvoiceSteps.ConfirmSend);
            }}
          />
        ) : (
          <ConfirmSendInvoiceStep
            onGoBack={() => setStep(step - 1)}
            data={data}
            onConfirm={confirmSendInvoice}
          />
        )}
      </Modal>
    </>
  );
};
