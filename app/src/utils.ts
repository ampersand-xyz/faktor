import { PublicKey } from "@solana/web3.js";

export function assertExists(value: any | null | undefined) {
  if (value === null || value === undefined) {
    throw new Error("Value is not defined");
  }
}

export function abbreviate(publicKey: PublicKey): string {
  return (
    publicKey.toString().slice(0, 4) + "..." + publicKey.toString().slice(-4)
  );
}
