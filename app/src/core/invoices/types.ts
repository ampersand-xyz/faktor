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
  amount: number;
  collector: PublicKey;
  debtor: PublicKey;
  initialDebt: number;
  issuer: PublicKey;
  memo: string;
  paidDebt: number;
  remainingDebt: number;
  status: InvoiceStatus;
}

export interface Invoice {
  publicKey: PublicKey;
  account: InvoiceAccount;
}

export interface InvoicesStore {
  issued: Invoice[];
  received: Invoice[];
}
