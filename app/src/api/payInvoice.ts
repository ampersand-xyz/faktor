import { BN, Program } from "@project-serum/anchor";
import { SystemProgram } from "@solana/web3.js";
import { Invoice } from "src/types";
import { assertExists } from "src/utils";

export type PayInvoiceRequest = {
  program?: Program;
  invoice?: any;
  amount?: number;
};

export const payInvoice = async (req: PayInvoiceRequest): Promise<Invoice> => {
  // Validate request
  assertExists(req.program);
  assertExists(req.invoice);
  assertExists(req.amount);

  try {
    await req.program.rpc.pay(new BN(req.amount), {
      accounts: {
        invoice: req.invoice.publicKey,
        creditor: req.invoice.account.creditor,
        debtor: req.invoice.account.debtor,
        systemProgram: SystemProgram.programId,
      },
    });

    // Return on-chain invoice
    const invoice = await req.program.account.invoice.fetch(
      req.invoice.publicKey
    );
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
    throw new Error(`Failed to pay invoice: ${error.message}`);
  }
};
