import { CounterAccount } from '@models';
import { getCounterProgram } from '@programs';
import { Provider } from '@project-serum/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, Keypair } from '@solana/web3.js';
import { logger } from '@utils';

export async function incrementCounter(
  url: string,
  wallet: AnchorWallet,
): Promise<CounterAccount> {
  const connection = new Connection(url, 'confirmed');
  const provider = new Provider(connection, wallet, {
    preflightCommitment: 'recent',
  });
  const program = getCounterProgram(provider);

  const counter = Keypair.generate();

  await program.rpc.increment({
    accounts: {
      baseAccount: counter.publicKey,
    },
  });

  const account = await program.account.counter.fetch(counter.publicKey);
  logger.success('Incremented', account);
  return account;
}
