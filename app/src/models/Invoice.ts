export interface InvoiceData {
  sender: StringPublicKey;
  recipient: StringPublicKey;
  lamports: number;
  note: string;
  createdAt: number;
}
