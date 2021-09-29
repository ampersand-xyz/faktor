import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ReactNode } from 'react';
import { DefaultHeader, ConnectedHeader } from './app/Header';

const Content = ({ children }) => {
  return <div className="px-5 py-8">{children}</div>;
};

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const wallet = useWallet();

  if (!wallet.connected) {
    return (
      <main>
        <DefaultHeader />
        <Content>
          <WalletMultiButton />
        </Content>
      </main>
    );
  }

  return (
    <main>
      <ConnectedHeader />
      <Content>{children}</Content>
    </main>
  );
};
