import { Modal } from '@ui/common';
import { InvoiceData } from '@core/invoice';
import { useState } from 'react';
import { AmountAndRecipientStep } from './AmountAndRecipientStep';
import { ConfirmSendInvoiceStep } from './ConfirmSendInvoiceStep';
import { PrimaryAction } from '@ui/common';
import { useConnectedApp } from '@stores';
import { CheckingRecipientExistsStep } from './CheckingRecipientExistsStep';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export enum SendInvoiceSteps {
  ChooseRecipientAndAmount = 0,
  CheckingRecipientExists = 1,
  ConfirmSend = 2
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
    const _data = { ...data, amount: data.amount * LAMPORTS_PER_SOL };
    await invoicesManager?.createInvoice(_data).catch((error) => {
      console.error('Failed to issue invoice:', { error, data });
    });
    closeModal();
  };

  return (
    <>
      <PrimaryAction onClick={openModal}>Send Invoice</PrimaryAction>
      <Modal open={modalOpen} onClose={closeModal}>
        {step === SendInvoiceSteps.ChooseRecipientAndAmount && (
          <AmountAndRecipientStep
            initialData={data}
            onCancel={closeModal}
            onConfirm={(_data) => {
              setData(_data);
              setStep(SendInvoiceSteps.CheckingRecipientExists);
            }}
          />
        )}
        {step === SendInvoiceSteps.CheckingRecipientExists && (
          <CheckingRecipientExistsStep
            recipientAddress={data.debtor}
            onVerified={() => setStep(step + 1)}
            onGoBack={() => setStep(step - 1)}
          />
        )}
        {step === SendInvoiceSteps.ConfirmSend && (
          <ConfirmSendInvoiceStep
            onGoBack={() => setStep(step - 2)}
            data={data}
            onConfirm={confirmSendInvoice}
          />
        )}
      </Modal>
    </>
  );
};

export const CheckCircleIcon = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} h-5 w-5`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
};
