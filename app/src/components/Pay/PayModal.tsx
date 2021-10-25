import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useMemo } from "react";
import { payInvoice, PayInvoiceRequest } from "src/api/payInvoice";
import { ConfirmationForm } from "./ConfirmationForm";

export enum PayInvoiceSteps {
  Editing = 0,
  Confirmation = 1,
}
interface PayModalProps {
  invoice: any;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: any;
  program: any;
}

export const PayModal: React.FC<PayModalProps> = ({
  invoice,
  open,
  setOpen,
  refresh,
  program,
}) => {
  const request: PayInvoiceRequest = useMemo(() => {
    return {
      program,
      invoice,
      amount: invoice.account.balance,
    };
  }, [program, invoice]);

  const onConfirm = async () => {
    payInvoice(request)
      .then(() => {
        onClose();
        refresh();
      })
      .catch((error) => {
        console.warn("Failed to pay invoice: ", error.message);
      });
  };

  const onClose = () => {
    setOpen(false);
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
            <div className="inline-block w-full max-w-2xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform rounded-lg shadow-xl bg-gray-50 sm:my-8 sm:align-middle sm:p-6">
              <div className="flex items-center my-4 divide-x-2">
                <ConfirmationForm
                  request={request}
                  onCancel={onClose}
                  onConfirm={onConfirm}
                />
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
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
