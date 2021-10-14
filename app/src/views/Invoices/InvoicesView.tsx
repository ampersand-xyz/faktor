import { Program, Provider, web3 } from "@project-serum/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import { SendInvoice } from "src/components";
import idl from "../../idl.json";
import { InvoiceTable } from "./InvoiceTable";

const programID = new PublicKey(idl.metadata.address);

const opts: web3.ConfirmOptions = {
  preflightCommitment: "processed",
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const tabs = [{ name: "All" }, { name: "Creditor" }, { name: "Debtor" }];

interface IInvoices {
  all: any[];
  debtor: any[];
  creditor: any[];
}

export interface InvoicesViewProps {
  wallet: AnchorWallet;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({ wallet }) => {
  const [invoices, setInvoices] = useState<IInvoices>({
    all: [],
    debtor: [],
    creditor: [],
  });

  const [currentTab, setCurrentTab] = useState("All");

  const provider = useMemo(() => {
    // Create the provider and return it to the caller
    // Network set to local network for now
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, opts.preflightCommitment);
    return new Provider(connection, wallet, opts);
  }, []);

  const program = useMemo(() => {
    return new Program(idl as any, programID, provider);
  }, [provider]);

  async function getInvoices() {
    const allInvoices: any = await program.account.invoice.all();
    setInvoices({
      all: allInvoices,
      debtor: allInvoices.filter(
        (inv: any) =>
          inv.account.debtor.toString() === wallet.publicKey.toString()
      ),
      creditor: allInvoices.filter(
        (inv: any) =>
          inv.account.creditor.toString() === wallet.publicKey.toString()
      ),
    });
  }

  useEffect(() => {
    getInvoices();
  }, []);

  return (
    <div className="relative flex h-screen overflow-hidden bg-gray-100">
      <div className="flex-1 overflow-auto focus:outline-none">
        <main className="relative z-0 flex-1 pb-8 overflow-y-auto">
          {/* Page header */}
          <div className="mt-8">
            <div className="max-w-6xl px-8 mx-auto mt-4">
              <div className="py-4">
                <h2 className="text-lg font-medium leading-6 text-left text-gray-900">
                  Recent activity
                </h2>
              </div>
              <div className="flex items-center justify-between">
                <nav className="flex space-x-4" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <a
                      onClick={() => setCurrentTab(tab.name)}
                      key={tab.name}
                      className={classNames(
                        tab.name === currentTab
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-500 hover:text-gray-700",
                        "px-3 py-2 font-medium text-sm rounded-md cursor-pointer"
                      )}
                    >
                      {tab.name}
                    </a>
                  ))}
                </nav>
                <div className="py-2">
                  <SendInvoice program={program} provider={provider} />
                </div>
              </div>
            </div>
            {/* Activity table (small breakpoint and up) */}
            <div className="hidden sm:block">
              <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
                <div className="flex flex-col mt-2">
                  <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
                    {currentTab === "All" ? (
                      <InvoiceTable
                        invoices={invoices.all}
                        currentTab={currentTab}
                      />
                    ) : currentTab === "Creditor" ? (
                      <InvoiceTable
                        invoices={invoices.creditor}
                        currentTab={currentTab}
                      />
                    ) : (
                      <InvoiceTable
                        invoices={invoices.debtor}
                        currentTab={currentTab}
                      />
                    )}
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
