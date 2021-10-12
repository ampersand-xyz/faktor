import { Program, BN, parseIdlErrors, ProgramError, Provider } from '@project-serum/anchor';
import {
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction
} from '@solana/web3.js';
import { InvoiceData, Invoice } from './types';
import { IDL } from '@core/idl';
import { INVOICE_DATA_SIZE, INVOICE_NONCE_SEED_STRING } from '@core/constants';
import { getOrCreateUserKeypair } from '@core/user';

export const createInvoice = async (provider: Provider, data: InvoiceData): Promise<Invoice> => {
  const program = new Program(IDL, IDL.metadata.address, provider);

  // TODO check if we already have a keypair generated for this wallet,
  // if not, create one, and store it where we can find it by the wallet.
  const user = await getOrCreateUserKeypair(provider.connection);

  const invoicePubkey = await PublicKey.createWithSeed(
    user.publicKey,
    INVOICE_NONCE_SEED_STRING,
    program.programId
  );

  const rentRequired = await provider.connection.getMinimumBalanceForRentExemption(
    INVOICE_DATA_SIZE
  );

  const transaction = new Transaction().add(
    SystemProgram.createAccountWithSeed({
      fromPubkey: user.publicKey,
      basePubkey: user.publicKey,
      seed: INVOICE_NONCE_SEED_STRING,
      newAccountPubkey: invoicePubkey,
      lamports: rentRequired,
      space: INVOICE_DATA_SIZE,
      programId: program.programId
    })
  );
  const hash = await sendAndConfirmTransaction(provider.connection, transaction, [user]);

  const charlie = Keypair.generate();
  const bnAmount = new BN(data.amount);
  const debtorPublicKey = new PublicKey(data.debtor);

  try {
    await program.rpc.issueInvoice(bnAmount, data.memo, {
      accounts: {
        collector: charlie.publicKey,
        debtor: debtorPublicKey,
        invoice: invoicePubkey,
        issuer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId
      },
      signers: [user]
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
