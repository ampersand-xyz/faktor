import { Connection } from '@solana/web3.js';
import fs from 'mz/fs';
import yaml from 'yaml';
import { CONFIG_FILE_PATH } from './constants';

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

export async function getConfig(): Promise<any> {
  const configYml = await fs.readFile(CONFIG_FILE_PATH, { encoding: 'utf8' });
  return yaml.parse(configYml);
}