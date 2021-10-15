import {Connection, PublicKey} from "@solana/web3.js";

export const checkWalletAddressExists=async (connection: Connection,value: string) => {
  console.log(`Checking wallet ${value} exists...`)
  try {
    const pubkey=new PublicKey(value);
    const response=await connection.getAccountInfo(pubkey);
    console.log(
      response===null? `❌ Wallet ${value} does not exist`:`✅ Wallet ${value} exists!`
    );
    return response!==null;
  } catch(err) {
    console.log(`❌ Wallet ${value} does not exist. `,err);
    return false;
  }
};