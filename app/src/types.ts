import { PublicKey } from "@solana/web3.js";

export interface InvoiceData {
  creditor: PublicKey;
  debtor: PublicKey;
  balance: number;
  memo: string;
  issuedAt: number;
}

export interface Invoice {
  address: PublicKey;
  data: InvoiceData;
}
