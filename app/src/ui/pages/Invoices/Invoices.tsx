import { CashIcon } from '@heroicons/react/solid';
import { BN, Program, Provider, web3 } from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { useConnectedApp } from '@stores';
import { useEffect, useState } from 'react';
import idl from '../../../idl.json';

import { InvoicesHeader } from './InvoicesHeader';

const { SystemProgram, Keypair } = web3;

const programID = new PublicKey(idl.metadata.address);

const bob = Keypair.generate();
const charlie = Keypair.generate();

const opts: web3.ConfirmOptions = {
  preflightCommitment: 'processed'
};

const statusStyles = {
  open: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-gray-800',
  spam: 'bg-orange-100 text-gray-800',
  void: 'bg-indigo-100 text-gray-800'
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const Invoices = () => {
  const { wallet, invoicesManager } = useConnectedApp();

  return (
    <div className="relative flex h-screen overflow-hidden bg-gray-100">
      <div className="flex-1 overflow-auto focus:outline-none">
        <main className="relative z-0 flex-1 pb-8 overflow-y-auto">
          {/* Page header */}
          <div className="mt-8">
            <InvoicesHeader />
            {/* Activity table (small breakpoint and up) */}
            <div className="hidden sm:block">
              <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
                <div className="flex flex-col mt-2">
                  <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                            Invoices
                          </th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50">
                            Note
                          </th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase bg-gray-50">
                            Amount
                          </th>
                          <th className="hidden px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50 md:block">
                            Status
                          </th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase bg-gray-50">
                            Date
                          </th>
                        </tr>
                      </thead>
                      {invoicesManager.store.issued.length > 1 ? (
                        <tbody className="bg-white divide-y divide-gray-200">
                          {invoicesManager.store.issued.map((invoice, i) => {
                            const status = Object.keys(
                              invoice.account.status
                            )[0] as keyof typeof statusStyles;

                            const pubKey = invoice.publicKey.toString();

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
                                <td className="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:block">
                                  <span>{invoice.account.memo}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                                  <div className="flex space-x-2">
                                    <span className="font-medium text-gray-900">
                                      {invoice.account.remainingDebt.words[0]}
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
                                            <rect width="397.7" height="311.7" fill="white" />
                                          </clipPath>
                                        </defs>
                                      </svg>
                                    </div>
                                  </div>
                                </td>
                                <td className="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:block">
                                  <span
                                    className={classNames(
                                      statusStyles[status],
                                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize'
                                    )}
                                  >
                                    {status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                                  {/* <time dateTime={transaction.datetime}>
                                  {transaction.date}
                                </time> */}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      ) : (
                        <div>no invoices</div>
                      )}
                    </table>
                    {/* Pagination */}
                    <nav
                      className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6"
                      aria-label="Pagination"
                    >
                      <div className="hidden sm:block">
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">1</span> to{' '}
                          <span className="font-medium">10</span> of{' '}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
