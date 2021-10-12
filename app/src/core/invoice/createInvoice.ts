import { Program, BN, parseIdlErrors, ProgramError, Provider } from '@project-serum/anchor';
import { Keypair, PublicKey, Signer, SystemProgram } from '@solana/web3.js';
import { InvoiceData, Invoice } from './types';
import { IDL } from '@core/idl';
import { INVOICE_NONCE_SEED_STRING } from '@core/constants';

export const createInvoice = async (provider: Provider, data: InvoiceData): Promise<Invoice> => {
  const program = new Program(IDL, IDL.metadata.address, provider);

  // TODO check if we already have a keypair generated for this wallet,
  // if not, create one, and store it where we can find it by the wallet.
  const user: Signer = Keypair.generate();

  const invoicePubkey = await PublicKey.createWithSeed(
    user.publicKey,
    INVOICE_NONCE_SEED_STRING,
    program.programId
  );

  const charlie = Keypair.generate();
  const bnAmount = new BN(data.amount);
  const debtorPublicKey = new PublicKey(data.debtor);

  try {
    await program.rpc.issueInvoice(bnAmount, data.memo, {
      accounts: {
        creditor: charlie.publicKey,
        debtor: debtorPublicKey,
        escrow: invoicePubkey,
        issuer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId
      }
    });

    const issuedInvoice = await program.account.invoice.fetch(invoicePubkey);

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
