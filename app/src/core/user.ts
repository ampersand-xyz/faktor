import { Wallet } from '@project-serum/anchor';
import * as spl from '@solana/spl-token';
import * as web3 from '@solana/web3.js';

export const getOrCreateUserKeypair = async (
  connection: web3.Connection
): Promise<web3.Keypair> => {
  const fromWallet = Wallet.local().payer;

  // Fund SOL into new wallet so it can mint
  const fromWalletAirdropSignature = await connection.requestAirdrop(
    fromWallet.publicKey,
    web3.LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(fromWalletAirdropSignature);

  // Create new mint token
  const mintToken = await spl.Token.createMint(
    connection,
    fromWallet,
    fromWallet.publicKey,
    null,
    9,
    spl.TOKEN_PROGRAM_ID
  );

  const fromTokenAccount = await mintToken.getOrCreateAssociatedAccountInfo(fromWallet.publicKey);

  const toWallet = web3.Keypair.generate();
  const toTokenAccount = await mintToken.getOrCreateAssociatedAccountInfo(toWallet.publicKey);

  await mintToken.mintTo(fromTokenAccount.address, fromWallet.publicKey, [], web3.LAMPORTS_PER_SOL);

  const tx = await new web3.Transaction().add(
    spl.Token.createTransferInstruction(
      spl.TOKEN_PROGRAM_ID,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet.publicKey,
      [],
      1
    )
  );

  // Sign transaction, broadcast, and confirm
  const signature = await web3.sendAndConfirmTransaction(connection, tx, [fromWallet], {
    commitment: 'confirmed'
  });
  console.log('SIGNATURE', signature);

  return fromWallet;
};
