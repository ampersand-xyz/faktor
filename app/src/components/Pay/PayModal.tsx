import { Dialog, Transition } from "@headlessui/react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Fragment, useState } from "react";
import { payInvoice, PayInvoiceRequest } from "src/api/payInvoice";
import { ConfirmationStep } from "./ConfirmationStep";
import { EditingStep } from "./EditingStep";

export enum PayInvoiceSteps {
  Editing = 0,
  Confirmation = 1,
}
interface PayModalProps {
  invoice: any;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  program: any;
  provider: any;
}

export const PayModal: React.FC<PayModalProps> = ({
  invoice,
  open,
  setOpen,
  program,
  provider,
}) => {
  const wallet = useAnchorWallet();

  const [amount, setAmount] = useState("");

  const [step, setStep] = useState(PayInvoiceSteps.Editing);

  const [request, setRequest] = useState<PayInvoiceRequest | null>({
    program,
    invoice,
  });

  const onPay = () => {
    setStep(PayInvoiceSteps.Confirmation);
    setRequest({
      amount: parseFloat(amount),
      ...request,
    });
  };

  const onConfirm = async () => {
    console.log(request);
    if (!wallet) return;
    await payInvoice(request)
      .then(onClose)
      .catch((error) => {
        console.warn("Failed to issue invoice: ", error.message);
      });
  };

  const onClose = () => {
    setOpen(false);
    setStep(PayInvoiceSteps.Editing);
    setRequest({
      program,
      invoice,
    });
  };

  const pubKey = invoice.publicKey.toString();
  const balance = invoice.account.balance.toString();
  const note = invoice.account.memo;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
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
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
              <div className="flex items-center my-4 divide-x-2">
                <div className="pl-3 pr-8 text-left">
                  <Dialog.Title
                    as="h2"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Invoice:{" "}
                    <span className="text-sm font-medium text-gray-700">
                      {pubKey}
                    </span>
                  </Dialog.Title>
                  <Dialog.Title
                    as="h2"
                    className="mt-2 text-base font-medium leading-6 text-gray-900"
                  >
                    <span className="flex items-center">
                      {" "}
                      Balance: {balance} SOL{" "}
                      <svg
                        className="w-4 h-4 mt-0.5 ml-1"
                        viewBox="0 0 398 312"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0)">
                          <path
                            d="M64.6 237.9C67 235.5 70.3 234.1 73.8 234.1H391.2C397 234.1 399.9 241.1 395.8 245.2L333.1 307.9C330.7 310.3 327.4 311.7 323.9 311.7H6.5C0.700001 311.7 -2.2 304.7 1.9 300.6L64.6 237.9Z"
                            fill="url(#paint0_linear)"
                          />
                          <path
                            d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0H391.2C397 0 399.9 7 395.8 11.1L333.1 73.8C330.7 76.2 327.4 77.6 323.9 77.6H6.5C0.700001 77.6 -2.2 70.6 1.9 66.5L64.6 3.8Z"
                            fill="url(#paint1_linear)"
                          />
                          <path
                            d="M333.1 120.1C330.7 117.7 327.4 116.3 323.9 116.3H6.5C0.700001 116.3 -2.2 123.3 1.9 127.4L64.6 190.1C67 192.5 70.3 193.9 73.8 193.9H391.2C397 193.9 399.9 186.9 395.8 182.8L333.1 120.1Z"
                            fill="url(#paint2_linear)"
                          />
                        </g>
                        <defs>
                          <linearGradient
                            id="paint0_linear"
                            x1="360.879"
                            y1="-37.4553"
                            x2="141.213"
                            y2="383.294"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#00FFA3" />
                            <stop offset="1" stop-color="#DC1FFF" />
                          </linearGradient>
                          <linearGradient
                            id="paint1_linear"
                            x1="264.829"
                            y1="-87.6014"
                            x2="45.163"
                            y2="333.147"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#00FFA3" />
                            <stop offset="1" stop-color="#DC1FFF" />
                          </linearGradient>
                          <linearGradient
                            id="paint2_linear"
                            x1="312.548"
                            y1="-62.688"
                            x2="92.8822"
                            y2="358.061"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#00FFA3" />
                            <stop offset="1" stop-color="#DC1FFF" />
                          </linearGradient>
                          <clipPath id="clip0">
                            <rect width="397.7" height="311.7" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-lg text-gray-500">Note: {note}</p>
                  </div>
                </div>
                {step === PayInvoiceSteps.Editing && (
                  <EditingStep
                    balance={balance}
                    amount={amount}
                    setAmount={setAmount}
                    onPay={onPay}
                  />
                )}
                {step === PayInvoiceSteps.Confirmation && (
                  <ConfirmationStep
                    balance={balance}
                    amount={amount}
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
