import { decode } from 'bs58';
import { Keypair, PublicKey } from '@solana/web3.js';

export type PrivateKey = number[] | string | Buffer | Uint8Array;
export type PublicKeyBase58 = string;
type KeyMaterial = Keypair | PrivateKey | PublicKeyBase58 | PublicKey;

export const isKeypair = (k: KeyMaterial): k is Keypair => k instanceof Keypair;
export const isPublicKey = (k: KeyMaterial): k is PublicKey => k instanceof PublicKey;

export const privateKeyIsArray = (privateKey: PrivateKey): privateKey is number[] =>
  Array.isArray(privateKey);
export const privateKeyIsString = (privateKey: PrivateKey): privateKey is string =>
  typeof privateKey === 'string';
export const privateKeyIsBuffer = (privateKey: PrivateKey): privateKey is Buffer =>
  Buffer.isBuffer(privateKey);
export const privateKeyIsUint8Array = (privateKey: PrivateKey): privateKey is Uint8Array =>
  privateKey instanceof Uint8Array;

/**
 * Create a Solana keypair object from an x25519 private key
 * @param privateKey
 */
export const makeKeypair = (privateKey: PrivateKey): Keypair => {
  if (privateKeyIsArray(privateKey)) return Keypair.fromSecretKey(Buffer.from(privateKey));

  if (privateKeyIsUint8Array(privateKey) || privateKeyIsBuffer(privateKey))
    return Keypair.fromSecretKey(privateKey);

  if (privateKeyIsString(privateKey)) {
    const privateKeyHex = decode(privateKey);
    return Keypair.fromSecretKey(privateKeyHex);
  }

  throw new Error('Incompatible private key format');
};

export const toSolanaKeyMaterial = (k: KeyMaterial): Keypair | PublicKey => {
  if (isKeypair(k) || isPublicKey(k)) return k;

  try {
    return makeKeypair(k);
  } catch {
    return new PublicKey(k);
  }
};
