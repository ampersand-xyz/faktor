import { useFriends } from '@hooks';
import Select from 'react-select';

export function RecipientSelect() {
  const { loading, error, friends } = useFriends();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Select
      options={friends.map((friend) => ({
        value: friend.publicKey,
        label: `${friend.firstName} ${friend.lastName}`,
      }))}
    />
  );
}
