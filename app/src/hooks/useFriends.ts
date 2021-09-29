import { getUserFriends } from '@actions';
import { useAppState } from '@contexts';
import { Friend } from '@models';
import useSWR from 'swr';

export function useFriends() {
  const {
    state: { wallet: userWallet, endpoint },
  } = useAppState();

  async function fetcher(_: any) {
    const address = userWallet.publicKey.toString();
    const response = await getUserFriends({ url: endpoint.url, address });
    return response;
  }
  const key = `/user/friends`;
  const { data, error } = useSWR(key, fetcher);
  const friends: Friend[] = data ?? [];
  const loading = !data && !error;
  return { error, loading, friends };
}
