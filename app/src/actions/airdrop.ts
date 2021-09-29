import { Connection, PublicKey } from '@solana/web3.js';

export async function airdrop(
  url: string,
  address: string,
  amount: number,
): Promise<{ hash: string }> {
  const connection = new Connection(url, 'confirmed');
  const publicKey = new PublicKey(address);
  const hash = await connection.requestAirdrop(publicKey, amount);
  await connection.confirmTransaction(hash);

  return { hash };
}
