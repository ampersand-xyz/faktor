import { useEffect, useMemo, useState } from 'react';

import { useFriends } from '@hooks';
import { Recipient } from '@models';
import { RecipientSelect, SolanaLogo } from '@components';

export const NewView = () => {
  const {
    loading: friendsLoading,
    error: friendsError,
    friends,
  } = useFriends();

  const [lamports, setLamports] = useState(0);
  const [note, setNote] = useState('');

  const [recipient, setRecipient] = useState<Recipient | null>(null);

  useEffect(() => {
    if (recipient || friendsLoading || friendsError) return;

    setRecipient(friends[0]);
  }, [friendsLoading, friendsError]);

  const isDisabled = useMemo(
    () => lamports <= 0 || !recipient || !note,
    [lamports, recipient, note],
  );

  function sendRequest() {
    console.log('send request');
  }

  return (
    <div className="px-32 flex flex-col items-stretch gap-4">
      <div className="flex flex-col my-2 bg-white rounded-lg shadow-sm px-5 py-6 gap-3">
        <h3 className="font-semibold text-xl">Send request to</h3>
        <RecipientSelect selected={recipient} onChange={setRecipient} />
      </div>
      <div className="flex my-2 bg-white rounded-lg shadow-sm px-5 py-6 gap-3 justify-between">
        <div className="flex gap-3 items-center">
          <SolanaLogo size={20} />
          <p className="font-bold text-xl">SOL</p>
        </div>
        <label
          htmlFor="lamportsInput"
          className="flex items-center gap-2 text-sm"
        >
          <input
            name="lamports"
            type="number"
            className="border border-gray-200 rounded-lg max-w-xl px-4 py-2"
            value={lamports}
            onChange={({ currentTarget: { value } }) => {
              setLamports(parseInt(value));
            }}
          />
          lamports
        </label>
      </div>
      <textarea
        name="note"
        placeholder="What's it for?"
        className="w-full h-full rounded-lg px-4 py-3 my-2 bg-white shadow-sm resize-none"
        value={note}
        onChange={({ currentTarget: { value } }) => {
          setNote(value);
        }}
      />

      <button
        className="px-4 py-3 font-bold text-white bg-purple-500 rounded-lg disabled:bg-gray-300 disabled:text-gray-500 cursor-default"
        disabled={isDisabled}
        onClick={sendRequest}
      >
        Send
      </button>
    </div>
  );
};
