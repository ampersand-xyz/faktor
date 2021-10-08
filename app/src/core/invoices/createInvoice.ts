import { createAnchorProvider } from '../utils';
import { Program, BN, Wallet, parseIdlErrors, ProgramError } from '@project-serum/anchor';
import { Connection, Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { InvoiceData, Invoice } from './types';
import { InvoiceStatus } from '@core';
import { IDL } from '@core/idl';

export const createInvoice = async (
  connection: Connection,
  wallet: Wallet,
  data: InvoiceData
): Promise<Invoice> => {
  const provider = createAnchorProvider(connection, { preflightCommitment: 'processed' }, wallet);
  const program = new Program(IDL, IDL.metadata.address, provider);

  const invoice = Keypair.generate();
  const bnAmount = new BN(data.amount);
  const debtorPublicKey = new PublicKey(data.debtor);

  try {
    await program.rpc.issueInvoice(bnAmount, data.memo, {
      accounts: {
        invoice: invoice.publicKey,
        issuer: provider.wallet.publicKey,
        debtor: debtorPublicKey,
        systemProgram: SystemProgram.programId
      },
      signers: [invoice]
    });

    const issuedInvoice = await program.account.invoice.fetch(invoice.publicKey);
    console.log(`✅ Success: Issued invoice:`, issuedInvoice);
    return {
      publicKey: issuedInvoice.publicKey,
      account: {
        status: InvoiceStatus.Open,
        debtor: debtorPublicKey,
        amount: data.amount,
        memo: data.memo,
        remainingDebt: { words: [] as string[] }
      }
    };
  } catch (error) {
    const programError = ProgramError.parse(error, parseIdlErrors(IDL));
    if (programError) throw programError;
    else throw error;
  }
};
