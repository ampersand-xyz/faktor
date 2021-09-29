import { Friend } from '@models';
import { Connection, PublicKey } from '@solana/web3.js';

/**
 * todo get friends for current user
 */
export function getUserFriends({
  url,
  address,
}: {
  url: string;
  address: string;
}): Promise<Friend[]> {
  const publicKey = new PublicKey(address);
  const connection = new Connection(url, 'confirmed');

  const friends: Friend[] = [];

  return Promise.resolve(friends);
}
