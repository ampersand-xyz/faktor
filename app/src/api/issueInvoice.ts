import { BN, Program } from "@project-serum/anchor";
import { PublicKey, SystemProgram, SYSVAR_CLOCK_PUBKEY } from "@solana/web3.js";
import { assertExists } from "src/utils";
import { Invoice } from "src/types";

export type IssueInvoiceRequest = {
  program?: Program;
  creditor?: PublicKey;
  debtor?: PublicKey;
  balance?: number;
  memo?: string;
};

export const issueInvoice = async (
  req: IssueInvoiceRequest
): Promise<Invoice> => {
  // Validate request
  assertExists(req.program);
  assertExists(req.creditor);
  assertExists(req.debtor);
  assertExists(req.balance);
  assertExists(req.memo);

  // Execute RPC request
  const [address, bump] = await PublicKey.findProgramAddress(
    [req.creditor.toBuffer(), req.debtor.toBuffer()],
    req.program.programId
  );
  try {
    await req.program.rpc.issue(bump, new BN(req.balance), req.memo, {
      accounts: {
        invoice: address,
        creditor: req.creditor,
        debtor: req.debtor,
        systemProgram: SystemProgram.programId,
        clock: SYSVAR_CLOCK_PUBKEY,
      },
    });

    // Return on-chain invoice
    const invoice = await req.program.account.invoice.fetch(address);
    return {
      address: invoice.publicKey,
      data: {
        creditor: invoice.creditor,
        debtor: invoice.debtor,
        balance: invoice.balance,
        memo: invoice.memo,
        issuedAt: invoice.issuedAt,
      },
    };
  } catch (error: any) {
    throw new Error(`Failed to issue invoice: ${error.message}`);
  }
};
