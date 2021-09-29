import { Program, Provider } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { idlConfig } from '@utils';

const PROGRAM_ID = new PublicKey(idlConfig().metadata.address);

export function getCounterProgram(provider: Provider) {
  const idl = idlConfig();
  const program = new Program(idl, PROGRAM_ID, provider);
  return program;
}
