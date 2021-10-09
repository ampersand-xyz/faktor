import { Connection, PublicKey } from '@solana/web3.js';

export class SolService {
  constructor(private connection: Connection) {}

  async checkSolWalletExists(address: string) {
    console.log(`Checking wallet ${address} exists...`);
    try {
      const pubkey = new PublicKey(address);
      const response = await this.connection.getAccountInfo(pubkey);
      console.log(
        response === null ? `❌ Wallet ${address} does not exist` : `✅ Wallet ${address} exists!`
      );
      return response !== null;
    } catch (err) {
      console.log(`❌ Wallet ${address} does not exist. `, err);
      return false;
    }
  }
}
