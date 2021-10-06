import path from 'path';
import os from 'os';
import { ClusterID } from './enums';

export interface ICluster {
  id: string;
  name: string;
  url: string;
}

export const CLUSTERS: ICluster[] = [
  {
    id: ClusterID.MainNet,
    name: 'Mainnet Beta',
    url: 'https://api.mainnet-beta.solana.com'
  },
  {
    id: ClusterID.TestNet,
    name: 'Testnet',
    url: 'https://api.testnet.solana.com'
  },
  {
    id: ClusterID.DevNet,
    name: 'Devnet',
    url: 'https://api.devnet.solana.com'
  },
  {
    id: ClusterID.LocalNet,
    name: 'Localnet',
    url: 'http://127.0.0.1:8899'
  }
];

export const DEFAULT_CLUSTER_INDEX = 3;
export const DEFAULT_CLUSTER = CLUSTERS[DEFAULT_CLUSTER_INDEX];

// Programs hashes
export const CREATE_USER_PROGRAM = '3rThB5gshzxFy7C4KDSLVTfo21ELryPXcdBa2TKTxpCf';
export const CREATE_RIGHT_PROGRAM = 'EMRZCzE7DpG3sUY2x11mTV7hJfJCMk6oyFCS2uPyTvCi';
export const CREATE_NFTPRO_PROGRAM = 'DsyJA9WQfQUU9JSTHL9vjA9izHsRoymTLeFLHkhWX5oP';

// Crypto
export const CRYPTO_KEY = 'EMRZCzE7DpG3sUY2x11mTV7hJfJCMk6oyFCS2uPyTvCi';

export const CONFIG_FILE_PATH = path.resolve(
  os.homedir(),
  '.config',
  'solana',
  'cli',
  'config.yml'
);
