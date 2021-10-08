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

export const DEFAULT_CLUSTER_INDEX = process.env.NODE_ENV === 'production' ? 0 : 3;
export const DEFAULT_CLUSTER = CLUSTERS[DEFAULT_CLUSTER_INDEX];

export const SOL_PRECISION_STEP = '0.000000001';

export const SOLANA_LOGO_URL = 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=010';
