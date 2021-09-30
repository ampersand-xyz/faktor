import { clusterApiUrl } from '@solana/web3.js';

export const ENDPOINTS = [
  { name: 'localnet', url: 'http://127.0.0.1:8899' },
  { name: 'mainnet-beta', url: 'https://solana-api.projectserum.com/' },
  {
    name: 'devnet',
    url: clusterApiUrl('devnet')
  }
];

export type Endpoint = typeof ENDPOINTS[number];
