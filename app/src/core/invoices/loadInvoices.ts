import { getIdl } from '@core/idl';
import { createAnchorProvider } from '@core/utils';
import { Program, Wallet } from '@project-serum/anchor';
import { Connection } from '@solana/web3.js';
import { InvoicesStore } from './types';

export const loadInvoices = async (
  connection: Connection,
  wallet: Wallet
): Promise<InvoicesStore> => {
  console.log('getting invoices...');
  const provider = await createAnchorProvider(
    connection,
    { preflightCommitment: 'processed' },
    wallet
  );
  const idl = getIdl();
  const program = new Program(idl, idl.metadata.address, provider);

  const allInvoices = await program.account.invoice.all();
  const issuedInvoices = allInvoices.map(({ publicKey, account }) => ({ publicKey, ...account }));
  console.log('got invoices:\n\n', allInvoices);
  const store: InvoicesStore = { received: [], issued: issuedInvoices };
  return store;
};
