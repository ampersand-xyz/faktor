import { PublicKey } from '@solana/web3.js';

export type Recipient = { publicKey: PublicKey };

export interface Friend extends Recipient {
  firstName: string;
  lastName: string;
}
