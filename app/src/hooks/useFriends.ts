import { getUserFriends } from '@actions';
import { useAppState } from '@contexts';
import { Friend } from '@models';
import { useEffect, useState } from 'react';

export function useFriends() {
  const {
    state: { wallet: userWallet, endpoint },
  } = useAppState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    const initFriends = async () => {
      setLoading(true);
      setError(null);
      try {
        const address = userWallet.publicKey.toString();
        const response = await getUserFriends({ url: endpoint.url, address });
        setFriends(response);
      } catch (err) {
        err instanceof Error && setError(err);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };
    initFriends();
  }, []);

  return { loading, error, friends };
}
