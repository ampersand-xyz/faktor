import { IWallet } from '@core';
import { WalletNotFoundError } from '@solana/wallet-adapter-base';
import { PublicKey } from '@solana/web3.js';
import { eventing } from '@utils';
import { createContext, useContext, useEffect, useState } from 'react';

export interface IWalletContext {
  wallet: IWallet | null;
  walletPublicKey: PublicKey | null;
  disconnectWallet: () => any;
  connectWallet: () => any;
}

const WalletContext = createContext<IWalletContext | null>(null);
export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error();
  return context;
};

export const WalletProvider: React.FC = ({ children }) => {
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [walletPublicKey, setWalletPublicKey] = useState<PublicKey | null>(null);

  const [error, setError] = useState<string | null>(null);

  const clearWalletState = () => {
    setWalletPublicKey(null);
    setWallet(null);
  };

  const connectWallet = () => {
    if (wallet?.publicKey) {
      const walletPublicKey = wallet.publicKey;
      setWalletPublicKey(walletPublicKey);
      eventing.emit('connected');
    }
  };

  const disconnectWallet = () => {
    clearWalletState();
    eventing.emit('disconnected');
  };

  useEffect(() => {
    if (!wallet) return;
    wallet.on('connect', connectWallet);

    wallet.on('disconnect', disconnectWallet);
  }, [wallet]);

  useEffect(() => {
    if (wallet && wallet.autoApprove) {
      wallet.connect().catch((e: unknown) => {
        setWallet(null);
        const data = {
          message:
            e instanceof WalletNotFoundError
              ? 'Wallet extension not installed'
              : 'Wallet not connected, please try again'
        };
        setError(data.message);
      });

      wallet.autoApprove = false;
    }
  }, []);

  if (error) {
    return (
      <div>
        <h1>{error}</h1>
      </div>
    );
  }

  return (
    <WalletContext.Provider value={{ wallet, walletPublicKey, disconnectWallet, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
