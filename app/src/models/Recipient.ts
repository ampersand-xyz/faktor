export type Recipient = { address: string };

export interface Friend extends Recipient {
  firstName: string;
  lastName: string;
}
