import { Connection, PublicKey } from "@solana/web3.js";
import { Program, Provider, web3, BN } from "@project-serum/anchor";
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

  async function createInvoice() {
    const provider = await getProvider();

    // Create the program interface combining the idl, program ID, and provider
    const program = new Program(idl as any, programID, provider);

    try {
      const bob = Keypair.generate();
      const charlie = Keypair.generate();
      const [escrowAddress, bump] = await PublicKey.findProgramAddress(
        [
          provider.wallet.publicKey.toBuffer(),
          bob.publicKey.toBuffer(),
          charlie.publicKey.toBuffer(),
        ],
        program.programId
      );
      const balance = new BN(1234);
      const memo = `Ceci n'est pas un mémo`;
      await program.rpc.issue(bump, balance, memo, {
        accounts: {
          escrow: escrowAddress,
          issuer: provider.wallet.publicKey,
          debtor: bob.publicKey,
          creditor: charlie.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [],
      });

      const escrow: any = await program.account.escrow.fetch(escrowAddress);
      console.log("Account: ", escrow);
    } catch (err) {
      console.log("Transaction error: ", err);
    }
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
              onClick={createInvoice}
            >
              Create invoice
            </button>
          )}
        </div>
      </div>
    );
  }
};
