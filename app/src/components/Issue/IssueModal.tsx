import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Program, Provider } from "@project-serum/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { issueInvoice, IssueInvoiceRequest } from "src/api";
import { EditingStep } from "./EditingStep";
import { ConfirmationStep } from "./ConfirmationStep";

export enum IssueInvoiceSteps {
  Editing = 0,
  Confirmation = 1,
}

interface IssueModalProps {
  open: any;
  setOpen;
  provider: Provider;
  program: Program;
}

export const IssueModal = ({
  open,
  setOpen,
  provider,
  program,
}: IssueModalProps) => {
  const wallet = useAnchorWallet();
  const [step, setStep] = useState(IssueInvoiceSteps.Editing);
  const [request, setRequest] = useState<IssueInvoiceRequest | null>({
    program,
    creditor: provider.wallet.publicKey,
  });

  const onSubmit = (data: IssueInvoiceRequest) => {
    setRequest({
      debtor: data.debtor,
      balance: data.balance,
      memo: data.memo,
      ...request,
    });
    setStep(IssueInvoiceSteps.Confirmation);
  };

  const onConfirm = async () => {
    if (!wallet) return;
    await issueInvoice(request)
      .then(onClose)
      .catch((error) => {
        console.warn("Failed to issue invoice: ", error.message);
      });
  };

  const onClose = () => {
    setOpen(false);
    setStep(IssueInvoiceSteps.Editing);
    setRequest({
      program,
      creditor: provider.wallet.publicKey,
    });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block">
          {/* Background overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          {/* Modal */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block w-full max-w-4xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
              <div className="flex items-center my-4 divide-x-2">
                {step === IssueInvoiceSteps.Editing && (
                  <EditingStep
                    request={request}
                    onCancel={onClose}
                    onSubmit={onSubmit}
                  />
                )}
                {step === IssueInvoiceSteps.Confirmation && (
                  <ConfirmationStep
                    request={request}
                    onBack={() => setStep(step - 1)}
                    onConfirm={onConfirm}
                  />
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
