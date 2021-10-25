import { Connection, PublicKey } from "@solana/web3.js";

export const checkWalletAddressExists = async (
  connection: Connection,
  value: string
) => {
  try {
    const pubkey = new PublicKey(value);
    const response = await connection.getAccountInfo(pubkey);
    return response !== null;
  } catch (err) {
    return false;
  }
};
