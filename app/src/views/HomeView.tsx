import { Connection, PublicKey } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState } from "react";

import idl from "../idl.json";

const { SystemProgram, Keypair } = web3;
// Create an account
const baseAccount = Keypair.generate();
const opts: web3.ConfirmOptions = {
  preflightCommitment: "processed",
};

const programID = new PublicKey(idl.metadata.address);

export const HomeView = () => {
  const [value, setValue] = useState(null);
  const wallet = useWallet();

  async function getProvider() {
    // Create the provider and return it to the caller
    // Network set to local network for now
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(connection, wallet, opts);
    return provider;
  }

  async function createCounter() {
    const provider = await getProvider();
    console.log("HELLO");
    // Create the program interface combining the idl, program ID, and provider
    const program = new Program(idl as any, programID, provider);

    console.log("Program: ", program);
    console.log("BasedAccount: ", baseAccount.publicKey);
    console.log("User: ", provider.wallet.publicKey);
    console.log("SystemProgram: ", SystemProgram.programId);

    try {
      // Interact with the program via RPC
      const data = await program.rpc.create({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      });

      console.log("Data: ", data);

      const account: any = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );
      console.log("Account: ", account);
      setValue(account.count.toString());
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  async function increment() {
    const provider = await getProvider();
    const program = new Program(idl as any, programID, provider);
    await program.rpc.increment({
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    const account: any = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log("Account: ", account);
    setValue(account.count.toString());
  }

  if (!wallet.connected) {
    // If the user's wallet is not connected, display connect wallet button.
    return (
      <div className="flex justify-center pt-24">
        <WalletMultiButton />
      </div>
    );
  } else {
    return (
      <div className="App">
        <div>
          {!value && (
            <button
              className="px-4 py-3 font-bold text-white bg-blue-500 rounded"
              onClick={createCounter}
            >
              Create counter
            </button>
          )}
          {value && (
            <button
              className="px-4 py-3 font-bold text-white bg-purple-500 rounded"
              onClick={increment}
            >
              Increment counter
            </button>
          )}

          {value && value >= Number(0) ? (
            <h2>{value}</h2>
          ) : (
            <h3>Please create the counter.</h3>
          )}
        </div>
      </div>
    );
  }
};
