import { Idl } from '@project-serum/anchor';
import _idl from '../idl.json';

export interface IdlConfig extends Idl {
  metadata: {
    address: string;
  };
}

export const getIdl = (): IdlConfig => {
  const idl: IdlConfig = {
    version: _idl.version,
    name: _idl.name,
    instructions: _idl.instructions.map((item) => item as Idl['instructions'][number]),
    accounts: _idl.accounts as Idl['accounts'],
    types: _idl.types as Idl['types'],
    errors: _idl.errors as Idl['errors'],
    metadata: _idl.metadata
  };

  return idl;
};
