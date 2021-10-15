import { Dialog } from "@headlessui/react";

export interface ConfirmationStepProps {
  balance: string;
  amount: string;
  onBack: () => void;
  onConfirm: () => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  balance,
  amount,
  onBack,
  onConfirm,
}) => {
  const remainingBalance = parseFloat(balance) - parseFloat(amount);
  return (
    <div className="py-8 pl-8 text-left">
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm Payment
        </label>
        <div className="flex-col items-center space-y-3">
          <div className="relative mt-1 rounded-md">
            <div className="absolute inset-y-0 flex items-center pl-1 pointer-events-none -right-7">
              <span className="text-gray-500 sm:text-sm">
                <svg
                  className="w-6 h-6 ml-1"
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
            </div>
            <Dialog.Title
              as="h2"
              className="text-xl font-medium leading-6 text-gray-900"
            >
              Remaining Balnce:{" "}
              <span className="text-lg font-medium text-gray-700">
                {balance}
                {" - "}
                {amount} {" = "} {remainingBalance.toFixed(2)} SOL
              </span>
            </Dialog.Title>
          </div>
          <div className="flex">
            <button
              onClick={onBack}
              type="button"
              className="inline-flex items-center h-10 px-6 text-sm font-medium leading-4 text-white bg-gray-600 border border-transparent rounded-md shadow-sm -py-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Back
            </button>
            <button
              onClick={onConfirm}
              type="button"
              className="inline-flex items-center h-10 px-6 ml-2 text-sm font-medium leading-4 text-white bg-green-600 border border-transparent rounded-md shadow-sm -py-2 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
