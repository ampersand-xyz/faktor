

import {Provider} from '@project-serum/anchor';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import {issueInvoice} from 'src/api';
import {InvoiceData} from 'src/types';
import {PrimaryAction} from '../ActionButtons';
import { AmountAndRecipientStep } from './AmountAndRecipientStep';
import { ConfirmSendInvoiceStep } from './ConfirmSendInvoiceStep';
import {Modal} from '../Modal';

export enum SendInvoiceSteps {
  ChooseRecipientAndAmount = 0,
  ConfirmSend = 1
}

const initialData = { debtor: '', amount: -1, memo: '' };

export const SendInvoice = ({provider}: {provider: Provider}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState<InvoiceData>(initialData);
  const [step, setStep] = useState(SendInvoiceSteps.ChooseRecipientAndAmount);

  const wallet = useAnchorWallet();

  const closeModal = () => {
    setData(initialData);
    setStep(SendInvoiceSteps.ChooseRecipientAndAmount);
    setModalOpen(false);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const confirmSendInvoice = async () => {
    if (!wallet) return
    console.log('Confirmed invoice to send: ', JSON.stringify(data));

    await issueInvoice(provider, data).catch((error) => {
      console.warn('UNHANDLED ERROR -- TODO');
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
