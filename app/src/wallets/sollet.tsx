import { IWallet } from '@core';
import Wallet from '@project-serum/sol-wallet-adapter';

export default class SolletProvider extends Wallet implements IWallet {
  constructor(cluster: string) {
    super('https://www.sollet.io', cluster);
  }
}