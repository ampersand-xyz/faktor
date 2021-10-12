import { Idl } from '@project-serum/anchor';

import _idl from './idl.json';

interface IdlConfig extends Omit<Required<Idl>, 'events' | 'state'> {
  metadata: { address: string };
}

export const IDL = _idl as IdlConfig;
