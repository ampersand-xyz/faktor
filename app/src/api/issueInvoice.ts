import {BN, Idl, Program, Provider} from '@project-serum/anchor';
import {AnchorWallet} from '@solana/wallet-adapter-react';
import {Connection,Keypair,PublicKey,SystemProgram} from '@solana/web3.js';
import {InvoiceData,Invoice,InvoiceStatus} from 'src/types';
import IDL from '../idl.json'

export const generateInvoiceAccount = async (walletPubkey: PublicKey, debtorPubkey: PublicKey, creditorPubkey: PublicKey, programPubkey: PublicKey) => {
  const [invoiceAddress, bump] = await PublicKey.findProgramAddress([walletPubkey.toBuffer(), debtorPubkey.toBuffer(), creditorPubkey.toBuffer()], programPubkey);
  const invoice = {
    address: invoiceAddress,
    bump
  }
  return invoice
}


export const issueInvoice = async (
  connection: Connection,
  wallet: AnchorWallet,
  data: InvoiceData
): Promise<Invoice> => {
  const provider = new Provider(connection, wallet, {preflightCommitment: 'confirmed'})

  const program = new Program(IDL as Idl, IDL.metadata.address, provider);

  const escrow = Keypair.generate();
  const balance = new BN(data.amount);
  const debtorPublicKey = new PublicKey(data.debtor);
  const issuer = Keypair.generate()
  const creditor = Keypair.generate()

  const invoice = await generateInvoiceAccount(provider.wallet.publicKey, debtorPublicKey, creditor.publicKey, program.programId)
  
  try {
    await program.rpc.issue(invoice.bump, balance, data.memo, {
      accounts: {
        escrow: escrow.publicKey,
        issuer: provider.wallet.publicKey,
        creditor: creditor.publicKey,
        debtor: debtorPublicKey,
        systemProgram: SystemProgram.programId
      },
      signers: [issuer]
    });

    const issuedInvoice = await program.account.invoice.fetch(escrow.publicKey);
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
