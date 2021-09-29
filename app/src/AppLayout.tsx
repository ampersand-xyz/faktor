import { useWallet } from '@solana/wallet-adapter-react';
import { ReactNode } from 'react';

const Header = () => {
  const wallet = useWallet();

  if (!wallet.connected) return null;

  return (
    <header className="w-screen h-24 py-5 px-8 flex items-center gap-4">
      <a href="/">HOME</a>
      <a href="/new">NEW</a>
      <a href="/sent">SENT</a>
      <a href="/received">RECEIVED</a>
    </header>
  );
};

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="h-screen w-screen">
      <Header />
      {children}
    </main>
  );
};
