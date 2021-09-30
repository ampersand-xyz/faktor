export enum MessageStatus {
  PENDING = 'Pending',
  DECLINED = 'Declined',
  CANCELLED = 'Cancelled',
  ACCEPTED = 'Accepted'
}

export interface MessageConfig {
  sender: StringPublicKey;
  recipient: StringPublicKey;
  // Amount requested in lamports
  amount: number;
  note: string;
}

export interface Message {
  config: MessageConfig;
  authority: StringPublicKey;
  status: MessageStatus;
}
