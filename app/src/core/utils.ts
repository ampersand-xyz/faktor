import { Provider, Wallet } from '@project-serum/anchor';
import { ConfirmOptions, Connection } from '@solana/web3.js';

export const createAnchorProvider = (
  connection: Connection,
  opts: ConfirmOptions,
  wallet: Wallet
) => {
  const provider = new Provider(connection, wallet, opts);
  return provider;
};
