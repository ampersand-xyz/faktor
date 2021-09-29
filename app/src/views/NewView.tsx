import { useState } from 'react';

export const NewView = () => {
  const [lamports, setLamports] = useState(0);

  return (
    <div>
      <h1>Request SOL</h1>
      <div>
        <input
          type="text"
          placeholder="0 lamports"
          value={lamports}
          onChange={({ currentTarget: { value } }) => {
            setLamports(parseFloat(value));
          }}
        />
      </div>
    </div>
  );
};
