import { CounterAccount } from '@models';
import { getCounterProgram } from '@programs';
import { Provider } from '@project-serum/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, Keypair, SystemProgram } from '@solana/web3.js';
import { logger } from '@utils';

export async function createCounter(
  url: string,
  wallet: AnchorWallet,
): Promise<CounterAccount> {
  const connection = new Connection(url, 'confirmed');
  const provider = new Provider(connection, wallet, {
    preflightCommitment: 'recent',
  });
  const program = getCounterProgram(provider);

  const counter = Keypair.generate();

  try {
    // Interact with the program via RPC
    await program.rpc.create({
      accounts: {
        baseAccount: counter.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [counter],
    });

    const account = await program.account.baseAccount.fetch(counter.publicKey);
    debugger;

    logger.success('Counter account', account);
    return account;
  } catch (err) {
    logger.error('Transaction error', err);
    const address = counter.publicKey.toString();
    const secret = JSON.stringify(Array.from(counter.secretKey));
    console.log({ address, secret });
    throw err;
  }
}
