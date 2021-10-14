import {BN, Program, Provider} from '@project-serum/anchor';
import {PublicKey,SystemProgram, SYSVAR_CLOCK_PUBKEY} from '@solana/web3.js';
import {InvoiceData,Invoice,InvoiceStatus} from 'src/types';

export const issueInvoice = async (
  program: Program,
  provider: Provider,
  data: InvoiceData,
): Promise<Invoice> => {

  const balance = new BN(data.amount);
  const debtorPublicKey = new PublicKey(data.debtor);

  console.log(`PROGRAM ID: ${program.programId.toString()}`)
  const [invoiceAddress, bump] = await PublicKey.findProgramAddress([provider.wallet.publicKey.toBuffer(), debtorPublicKey.toBuffer()], program.programId);

  const invoice = {
    address: invoiceAddress,
    bump
  }

  
  try {
    await program.rpc.issue(invoice.bump, balance, data.memo, {
      accounts: {
        invoice: invoice.address,
        creditor: provider.wallet.publicKey,
        debtor: debtorPublicKey,
        systemProgram: SystemProgram.programId,
        clock: SYSVAR_CLOCK_PUBKEY
      },
    });

    const issuedInvoice = await program.account.invoice.fetch(invoice.address);
    console.log(`\n✅ Success: Issued invoice:`, issuedInvoice, '\n');
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
    console.log(`\n❌ Error: Failed to issue invoice:`, error, '\n');
    throw new Error(
      `Failed to issue invoice: ${error instanceof Error ? error.message : 'Unknown error type'}`
    );
  }
};
