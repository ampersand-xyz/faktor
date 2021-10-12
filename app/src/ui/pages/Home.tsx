import { useWallet } from '@solana/wallet-adapter-react';

export const Home = () => {
  const { connected, publicKey: walletPublicKey } = useWallet();

  return (
    <>
      <div>
        <h1 color="text-white">Home</h1>
      </div>
      <div>
        <h3>{connected ? walletPublicKey?.toBase58() ?? '' : 'No connected wallet found.'}</h3>
      </div>
    </>
  );
};
