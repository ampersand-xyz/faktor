import { useState } from 'react';

export const NewView = () => {
  const [lamports, setLamports] = useState(0);
  const [note, setNote] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  return (
    <div>
      <h2>Send request to</h2>
      <div className="my-2 bg-white rounded-lg shadow-sm px-5 py-6">
        <p>{recipientAddress}</p>
      </div>
      <div>
        <input
          name="lamports"
          type="text"
          className="border border-gray-200 rounded-lg px-4 py-3"
          value={lamports}
          onChange={({ currentTarget: { value } }) => {
            setLamports(parseFloat(value));
          }}
        />
        <input
          name="note"
          type="text"
          placeholder="What's it for?"
          className="border border-gray-200 rounded-lg px-4 py-3"
          value={note}
          onChange={({ currentTarget: { value } }) => {
            setNote(value);
          }}
        />
      </div>
    </div>
  );
};
