export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface InvoiceData {
  sender: StringPublicKey;
  recipient: StringPublicKey;
  lamports: number;
  note: string;
  createdAt: number;
  acceptedAt: number;
  status: RequestStatus;
}
