import { Connection, PublicKey } from '@solana/web3.js';

export async function getBalance(
  url: string,
  address: string,
): Promise<number> {
  const publicKey = new PublicKey(address);
  const connection = new Connection(url, 'confirmed');
  const balance = await connection.getBalance(publicKey);
  if (balance === undefined) {
    throw new Error('Account not funded');
  }
  return balance;
}
