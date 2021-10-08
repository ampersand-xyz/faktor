import { createAnchorProvider } from '../utils';
import { Program, BN, Wallet, parseIdlErrors, ProgramError } from '@project-serum/anchor';
import { Connection, Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { InvoiceData, Invoice } from './types';
import { IDL } from '@core/idl';

export const createInvoice = async (
  connection: Connection,
  wallet: Wallet,
  data: InvoiceData
): Promise<Invoice> => {
  const provider = createAnchorProvider(connection, { preflightCommitment: 'processed' }, wallet);
  const program = new Program(IDL, IDL.metadata.address, provider);

  const invoice = Keypair.generate();
  const charlie = Keypair.generate();
  const bnAmount = new BN(data.amount);
  const debtorPublicKey = new PublicKey(data.debtor);

  try {
    await program.rpc.issueInvoice(bnAmount, data.memo, {
      accounts: {
        collector: charlie.publicKey,
        debtor: debtorPublicKey,
        invoice: invoice.publicKey,
        issuer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId
      },
      signers: [invoice, wallet]
    });

    const issuedInvoice = await program.account.invoice.fetch(invoice.publicKey);
    console.log(`✅ Success: Issued invoice:`, issuedInvoice);
    return {
      publicKey: issuedInvoice.publicKey,
      account: {
        amount: data.amount,
        collector: issuedInvoice.collector,
        debtor: debtorPublicKey,
        initialDebt: issuedInvoice.initialDebt,
        issuer: issuedInvoice.issuer,
        memo: data.memo,
        paidDebt: issuedInvoice.paidDebt,
        remainingDebt: issuedInvoice.remainingDebt,
        status: issuedInvoice.status
      }
    };
  } catch (error) {
    const programError = ProgramError.parse(error, parseIdlErrors(IDL));
    if (programError) throw programError;
    else throw error;
  }
};
