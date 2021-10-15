import { CashIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { PayModal } from "src/components/Pay";

export const InvoiceTable = ({
  invoices,
  currentTab,
  program,
  provider,
}: {
  invoices: any;
  currentTab: string;
  program: any;
  provider: any;
}) => {
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<any>();
  return (
    <>
      {invoices.length > 0 ? (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                  Public Key
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                  Note
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                  Amount
                </th>
                {currentTab === "Debtor" && (
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                    Date
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(invoices ?? []).map((invoice: any, i: number) => {
                const pubKey = invoice.publicKey.toString();
                const balance = invoice.account.balance.toString();

                return (
                  <tr key={i} className="bg-white">
                    <td className="w-full px-6 py-4 text-sm text-gray-900 max-w-0 whitespace-nowrap">
                      <div className="flex">
                        <a
                          href="#"
                          className="inline-flex space-x-2 text-sm truncate group"
                        >
                          <CashIcon
                            className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                          <p className="text-gray-500 truncate group-hover:text-gray-900">
                            {pubKey}
                          </p>
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                      <span>{invoice.account.memo}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <span className="font-medium text-gray-900">
                          {balance}
                        </span>
                        <div className="flex items-center">
                          SOL
                          <svg
                            className="w-4 h-4 ml-1"
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
                                <rect
                                  width="397.7"
                                  height="311.7"
                                  fill="white"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                      </div>
                    </td>
                    {currentTab === "Debtor" && (
                      <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setIsPayModalOpen(true);
                            setCurrentInvoice(invoice);
                          }}
                          type="button"
                          className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Pay
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <nav
            className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6"
            aria-label="Pagination"
          >
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">10</span> of{" "}
                <span className="font-medium">20</span> results
              </p>
            </div>
            <div className="flex justify-between flex-1 sm:justify-end">
              <a className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                Previous
              </a>
              <a className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                Next
              </a>
            </div>
          </nav>
        </>
      ) : (
        <div className="p-8 bg-white">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-gray-200 rounded-full">
            <CashIcon className="w-6 h-6 text-gray-500" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              No Invoices Found
            </h3>
          </div>
        </div>
      )}
      {currentInvoice && (
        <PayModal
          invoice={currentInvoice}
          open={isPayModalOpen}
          setOpen={setIsPayModalOpen}
          program={program}
          provider={provider}
        />
      )}
    </>
  );
};
