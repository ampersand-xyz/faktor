import { useAppContext } from '@stores';

export const Home = () => {
  const { connected, walletPublicKey } = useAppContext();

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
