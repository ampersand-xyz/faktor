import { Message } from '@models';
import { Idl, Program, Provider } from '@project-serum/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { logger } from '@utils';

import idlJson from '../idl.json';

interface FaktorIdl extends Idl {
  metadata: { address: string };
}

export function idl() {
  return idlJson as FaktorIdl;
}

function getMessageProgram(provider: Provider) {
  const faktorIdl = idl();
  const PROGRAM_ID = new PublicKey(faktorIdl.metadata.address);

  const program = new Program(faktorIdl, PROGRAM_ID, provider);
  return program;
}

export async function createMessage(url: string, wallet: AnchorWallet): Promise<Message> {
  const connection = new Connection(url, 'confirmed');
  const provider = new Provider(connection, wallet, {
    preflightCommitment: 'recent'
  });
  const program = getMessageProgram(provider);

  const message = Keypair.generate();

  try {
    // Interact with the program via RPC
    await program.rpc.create({
      accounts: {
        baseAccount: message.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId
      },
      signers: [message]
    });

    const account = await program.account.baseAccount.fetch(message.publicKey);
    debugger;

    logger.success('Message account', account);
    return account;
  } catch (err) {
    logger.error('Transaction error', err);
    const address = message.publicKey.toString();
    const secret = JSON.stringify(Array.from(message.secretKey));
    console.log({ address, secret });
    throw err;
  }
}
