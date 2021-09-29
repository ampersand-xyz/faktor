import { Friend } from '@models';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import faker from 'faker';
import times from 'lodash.times';

const fakeFriend = (): Friend => {
  const keypair = Keypair.generate();
  return {
    address: keypair.publicKey.toString(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  };
};

const mockFriends = (): Friend[] => times(10, () => fakeFriend());
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

  const friends: Friend[] = mockFriends();
  return Promise.resolve(friends);
}
