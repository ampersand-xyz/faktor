import { BN, Program } from "@project-serum/anchor";
import { SystemProgram } from "@solana/web3.js";
import { assertExists } from "src/utils";

export type PayInvoiceRequest = {
  program?: Program;
  invoice?: any;
  amount?: number;
};

export const payInvoice = async (req: PayInvoiceRequest): Promise<any> => {
  // Validate request
  assertExists(req.program);
  assertExists(req.invoice);
  assertExists(req.amount);

  // Execute request
  try {
    await req.program.rpc.pay(new BN(req.amount), {
      accounts: {
        invoice: req.invoice.publicKey,
        creditor: req.invoice.account.creditor,
        debtor: req.invoice.account.debtor,
        systemProgram: SystemProgram.programId,
      },
    });
    return null;
  } catch (error: any) {
    throw new Error(`Failed to pay invoice: ${error.message}`);
  }
};
