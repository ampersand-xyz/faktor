import { PublicKey } from '@solana/web3.js';

export enum InvoiceStatus {
  Open = 'open',
  Paid = 'paid',
  Rejected = 'rejected',
  Spam = 'spam',
  Void = 'void'
}
export interface InvoiceData {
  /* Recipient wallets's SOL address */
  debtor: string;
  /* Amount in lamports */
  amount: number;
  /* Note about what the invoice is for */
  memo: string;
}

export interface InvoiceAccount {
  debtor: PublicKey;
  amount: number;
  status: InvoiceStatus;
  memo: string;
  remainingDebt: {
    words: string[];
  };
}

export interface Invoice {
  publicKey: PublicKey;
  account: InvoiceAccount;
}

export interface InvoicesStore {
  issued: Invoice[];
  received: Invoice[];
}
