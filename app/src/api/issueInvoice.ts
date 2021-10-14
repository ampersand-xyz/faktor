import {BN, Idl, Program, Provider} from '@project-serum/anchor';
import {AnchorWallet} from '@solana/wallet-adapter-react';
import {Connection,PublicKey,SystemProgram, SYSVAR_CLOCK_PUBKEY} from '@solana/web3.js';
import {InvoiceData,Invoice,InvoiceStatus} from 'src/types';
import IDL from '../idl.json'

export const generateInvoiceAccount = async (walletPubkey: PublicKey, debtorPubkey: PublicKey,  programPubkey: PublicKey) => {
  const [invoiceAddress, bump] = await PublicKey.findProgramAddress([walletPubkey.toBuffer(), debtorPubkey.toBuffer()], programPubkey);
  const invoice = {
    address: invoiceAddress,
    bump
  }
  return invoice
}


export const issueInvoice = async (
  provider: Provider,
  data: InvoiceData,
): Promise<Invoice> => {


  const program = new Program(IDL as Idl, IDL.metadata.address, provider);

  const balance = new BN(data.amount);
  const debtorPublicKey = new PublicKey(data.debtor);

  const invoice = await generateInvoiceAccount(provider.wallet.publicKey, debtorPublicKey, program.programId)
  
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
