import { Idl } from '@project-serum/anchor';
import idl from './idl.json';

interface IdlConfig extends Idl {
  metadata: { address: string };
}

export function idlConfig() {
  return idl as IdlConfig;
}
