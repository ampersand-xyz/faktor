import { Program, Provider, web3 } from "@project-serum/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import { IssueModal, InvoiceTable } from "src/components";
import idl from "../idl.json";

const programID = new PublicKey(idl.metadata.address);

const opts: web3.ConfirmOptions = {
  preflightCommitment: "processed",
};

const tabs = [{ name: "All" }, { name: "Creditor" }, { name: "Debtor" }];

interface IInvoices {
  all: any[];
  debtor: any[];
  creditor: any[];
}

export interface HomeViewProps {
  wallet: AnchorWallet;
}

export const HomeView: React.FC<HomeViewProps> = ({ wallet }) => {
  const [invoices, setInvoices] = useState<IInvoices>({
    all: [],
    debtor: [],
    creditor: [],
  });

  const [currentTab, setCurrentTab] = useState("All");
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  const visibleInvoices = useMemo(() => {
    switch (currentTab) {
      case "All":
        return invoices.all;
      case "Creditor":
        return invoices.creditor;
      case "Debtor":
        return invoices.debtor;
    }
  }, [invoices, currentTab]);

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

  useEffect(() => {
    refreshInvoices();
  }, []);

  async function refreshInvoices() {
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

  return (
    <>
      <div className="flex flex-1 h-screen overflow-auto overflow-hidden bg-gray-100 focus:outline-none">
        <main className="z-0 flex-1 pb-8 overflow-y-auto">
          {/* Page header */}
          <div className="max-w-4xl mx-auto mt-8">
            <div className="mt-4">
              <div className="py-4">
                <h2 className="text-4xl font-bold leading-6 text-left text-gray-900">
                  Faktor
                </h2>
              </div>
            </div>
            {/* Toolbar */}
            <div className="flex items-center justify-between mt-4">
              {/* Invoice tabs */}
              <nav className="flex space-x-4" aria-label="Tabs">
                {tabs.map((tab) => (
                  <a
                    onClick={() => setCurrentTab(tab.name)}
                    key={tab.name}
                    className={`px-3 py-2 font-medium text-sm rounded-md cursor-pointer ${
                      tab.name === currentTab
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.name}
                  </a>
                ))}
              </nav>
              {/* "New Invoice" button */}
              <div className="py-2">
                <button
                  onClick={() => {
                    setIsIssueModalOpen(true);
                  }}
                  type="button"
                  className="inline-flex items-center px-4 py-3 text-lg font-semibold leading-4 text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600"
                >
                  New invoice
                </button>
              </div>
            </div>
            {/* Invoices table */}
            <div className="flex flex-col min-w-full mt-2 overflow-hidden overflow-x-auto rounded shadow">
              <InvoiceTable
                invoices={visibleInvoices}
                currentTab={currentTab}
              />
            </div>
          </div>
        </main>
      </div>
      <IssueModal
        open={isIssueModalOpen}
        setOpen={setIsIssueModalOpen}
        program={program}
        provider={provider}
      />
    </>
  );
};
