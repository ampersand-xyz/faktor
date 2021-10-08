import { Modal } from '@ui/common';
import { InvoiceData } from '@core/invoices/types';
import { useState } from 'react';
import { AmountAndRecipientStep } from './AmountAndRecipientStep';
import { ConfirmSendInvoiceStep } from './ConfirmSendInvoiceStep';
import { PrimaryAction } from '@ui/common';
import { useConnectedApp } from '@stores';

export enum SendInvoiceSteps {
  ChooseRecipientAndAmount = 0,
  ConfirmSend = 1
}

const initialData = { debtor: '', amount: -1, memo: '' };

export const SendInvoice = () => {
  const { invoicesManager } = useConnectedApp();

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

  const confirmSendInvoice = async () => {
    console.log('Confirmed invoice to send: ', JSON.stringify(data));
    await invoicesManager?.createInvoice(data).catch((error) => {
      console.warn('Failed to issue invoice:', { error, data });
    });
    closeModal();
  };

  return (
    <>
      <PrimaryAction onClick={openModal}>Send Invoice</PrimaryAction>
      <Modal open={modalOpen} onClose={closeModal}>
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
