import { Connection } from '@solana/web3.js';

export enum ClusterID {
  MainNet = 'mainnet-beta',
  TestNet = 'testnet',
  DevNet = 'devnet',
  Custom = 'custom',
  LocalNet = 'localhost'
}

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

let connection: Connection;
let cluster: string;

export async function connectToCluster(clusterUrl: string): Promise<Connection> {
  if (connection == null || clusterUrl !== cluster) {
    try {
      console.log('Create connection');
      connection = new Connection(clusterUrl, 'confirmed');
      console.log('Connecting...');
      await connection.getFirstAvailableBlock();
      console.log(`Connection to the "${clusterUrl}" established!`);
    } catch (err) {
      console.log('Unable to connect!');
      throw new Error('400');
    }
  }
  return connection;
}

const clusterTestQueue: string[] = [];

export const verifyCluster = async (
  clusterUrl: string,
  onValid: () => void,
  onInvalid: () => void
): Promise<void> => {
  try {
    clusterTestQueue.push(clusterUrl);
    await connectToCluster(clusterUrl);
    clusterTestQueue.splice(0, 1);
    onValid();
  } catch (err) {
    clusterTestQueue.splice(0, 1);
    onInvalid();
  }
};
