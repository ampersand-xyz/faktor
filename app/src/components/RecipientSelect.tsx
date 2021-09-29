import { useFriends } from '@hooks';
import { Recipient } from '@models';
import { useMemo } from 'react';
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

  const selectProps = useMemo(() => {
    const options = friends.map((friend) => ({
      value: friend.address,
      label: `${friend.firstName} ${friend.lastName}`,
    }));

    const selectedOption = options.find(
      (option) => option.value === selected?.address,
    );
    const props = { options, value: selectedOption };

    console.log('selectProps', props);

    return props;
  }, [friends.length, selected]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error.message}</p>;
  }

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

  return <Select<Option> {...selectProps} onChange={handleChange} />;
}
