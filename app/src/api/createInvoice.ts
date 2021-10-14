import {BN, Idl, Program, Provider} from '@project-serum/anchor';
import {AnchorWallet} from '@solana/wallet-adapter-react';
import {Connection,Keypair,PublicKey,SystemProgram} from '@solana/web3.js';
import {InvoiceData,Invoice,InvoiceStatus} from 'src/types';
import IDL from '../idl.json'

export const createInvoice = async (
  connection: Connection,
  wallet: AnchorWallet,
  data: InvoiceData
): Promise<Invoice> => {
  const provider = new Provider(connection, wallet, {preflightCommitment: 'confirmed'})

  const program = new Program(IDL as Idl, IDL.metadata.address, provider);

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
