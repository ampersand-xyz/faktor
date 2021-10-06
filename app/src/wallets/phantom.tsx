import { IWallet } from '@core';
import { PublicKey, Transaction } from '@solana/web3.js';
import EventEmitter from 'eventemitter3';

interface IPhantomWallet extends EventEmitter {
  publicKey: PublicKey | null;
  isConnected: boolean;
  autoApprove: boolean;
  connect: () => any;
  disconnect: () => any;
  signTransaction: (transaction: Transaction) => Promise<Transaction> | null;
  signAllTransactions: (transactions: Array<Transaction>) => Promise<Array<Transaction>> | null;
}

export default class PhantomProvider extends EventEmitter implements IWallet {
  get publicKey(): PublicKey | null {
    if (this.wallet) return this.wallet.publicKey;
    return null;
  }
  get connected(): boolean {
    if (this.wallet) return this.wallet.isConnected;
    return false;
  }
  get autoApprove(): boolean {
    if (this.wallet) return this.wallet.autoApprove;
    return false;
  }
  connect(): any {
    console.log('PhantomProvider CONNECT');
    if (this.wallet) this.wallet.connect();
  }
  disconnect(): any {
    if (this.wallet) this.wallet.disconnect();
  }
  signTransaction(transaction: Transaction): Promise<Transaction> | null {
    if (this.wallet) return this.wallet.signTransaction(transaction);
    return null;
  }
  signAllTransactions(transactions: Array<Transaction>): Promise<Array<Transaction>> | null {
    if (this.wallet) return this.wallet.signAllTransactions(transactions);
    return null;
  }

  private wallet: IPhantomWallet | undefined;
  constructor() {
    super();
    this.wallet = this.getPhantomWallet();
    if (this.wallet) {
      this.wallet.on('connect', (publicKey: PublicKey) => {
        this.emit('connect', publicKey);
      });
      this.wallet.on('disconnect', () => {
        this.emit('disconnect');
      });
    }
  }

  private getPhantomWallet(): IPhantomWallet | undefined {
    if ('solana' in window) {
      const provider = (window as any).solana;
      if (provider.isPhantom) return provider;
    }
    window.open('https://phantom.app/', '_blank');
  }
}
