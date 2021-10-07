import { IWallet } from '@core';
import { WalletNotFoundError } from '@solana/wallet-adapter-base';
import { PublicKey } from '@solana/web3.js';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export interface IWalletContext {
  wallet: IWallet | null;
  walletPublicKey: PublicKey | null;
  connected: boolean;
  disconnectWallet: () => void;
  connectWallet: (selectedWallet: IWallet) => void;
}

const WalletContext = createContext<IWalletContext | null>(null);
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error();
  return context;
};

export const WalletProvider: React.FC = ({ children }) => {
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [walletPublicKey, setWalletPublicKey] = useState<PublicKey | null>(null);

  const [error, setError] = useState<string | null>(null);

  const connected = useMemo(() => Boolean(walletPublicKey), [walletPublicKey]);

  const connectWallet = async (selectedWallet: IWallet) => {
    await selectedWallet.connect();

    if (selectedWallet.publicKey) {
      console.log(`SUCCESS: WALLET CONNECTED - ${selectedWallet.publicKey.toBase58()}`);
      setWallet(selectedWallet);
      setWalletPublicKey(selectedWallet.publicKey);
    }
  };

  const disconnectWallet = () => {
    if (wallet) {
      wallet.disconnect();
      setWalletPublicKey(null);
      setWallet(null);
    }
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
    <WalletContext.Provider
      value={{ wallet, walletPublicKey, connected, disconnectWallet, connectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};
