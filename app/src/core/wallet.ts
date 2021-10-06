// @ts-ignore
import { PublicKey, Transaction } from '@solana/web3.js';
import EventEmitter from 'eventemitter3';
import { WalletProviders } from './enums';
import sollet from '../assets/sollet.jpg';
import phantom from '../assets/phantom.jpg';
import PhantomProvider from '@wallets/phantom';
import SolletProvider from '@wallets/sollet';

export interface IWalletInfo {
  id: WalletProviders;
  name: string;
  icon: string;
}
export const walletInfo = (): IWalletInfo[] => {
  const info: IWalletInfo[] = [];

  info[WalletProviders.Sollet] = {
    id: WalletProviders.Sollet,
    name: 'Sollet',
    icon: sollet
  };
  info[WalletProviders.Phantom] = {
    id: WalletProviders.Phantom,
    name: 'Phantom',
    icon: phantom
  };

  return info;
};

export interface IWallet extends EventEmitter {
  publicKey: PublicKey | null;
  connected: boolean;
  autoApprove: boolean;
  connect: () => any;
  disconnect: () => any;
  signTransaction: (transaction: Transaction) => Promise<Transaction> | null;
  signAllTransactions: (transactions: Array<Transaction>) => Promise<Array<Transaction>> | null;
}

export function createWallet(provider: WalletProviders, cluster: string): IWallet {
  console.log(`Create new wallet. provider: ${provider}, cluster: ${cluster}`);
  switch (provider) {
    case WalletProviders.Phantom:
      return new PhantomProvider();
    default:
      return new SolletProvider(cluster);
  }
}
