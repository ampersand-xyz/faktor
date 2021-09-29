import { useFriends } from '@hooks';
import { Recipient } from '@models';
import Select, { SingleValue } from 'react-select';

type Option = { value: string; label: string };

export function RecipientSelect({
  selected,
  onChange,
}: {
  selected: Recipient | null;
  onChange: (val: Recipient) => void;
}) {
  const { loading, error, friends } = useFriends();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error.message}</p>;
  }

  const options = friends.map((friend) => ({
    value: friend.address,
    label: `${friend.firstName} ${friend.lastName}`,
  }));

  const selectedOption = options.find(
    (option) => option.value === selected?.address,
  );

  function handleChange(val: SingleValue<Option>) {
    if (val === null) return null;
    const { value } = val;
    const recipient = friends.find((friend) => friend.address === value);
    if (!recipient)
      throw new Error(
        `Could not find selected recipient option with address ${value}`,
      );
    onChange(recipient);
  }

  return (
    <Select<Option>
      options={options}
      value={selectedOption}
      onChange={handleChange}
    />
  );
}
