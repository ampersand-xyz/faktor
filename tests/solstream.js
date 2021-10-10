const assert = require("assert");
const anchor = require("@project-serum/anchor");
const solana = require("@solana/web3.js");

const { LAMPORTS_PER_SOL, SYSVAR_CLOCK_PUBKEY, SYSVAR_RENT_PUBKEY } = solana;
const { BN, Provider } = anchor;
const { SystemProgram, Keypair, PublicKey } = anchor.web3;

describe("solstream", () => {
  // Test environment
  const provider = Provider.local();
  const program = anchor.workspace.Solstream;
  anchor.setProvider(provider);

  /**
   * airdrop - Airdrops SOL to an account.
   *
   * @param {PublicKey} publicKey
   */
  async function airdrop(publicKey) {
    await provider.connection
      .requestAirdrop(publicKey, LAMPORTS_PER_SOL)
      .then((sig) => provider.connection.confirmTransaction(sig, "confirmed"));
  }

  /**
   * generateAccounts - Generates keypairs and PDAs for participants and program accounts needed in a test case
   *
   * @returns {object} The accounts needed for a test case
   */
  async function generateAccounts() {
    const alice = Keypair.generate();
    const bob = Keypair.generate();
    const charlie = Keypair.generate();
    const [streamAdress, bump] = await PublicKey.findProgramAddress(
      [alice.publicKey.toBuffer(), bob.publicKey.toBuffer()],
      program.programId
    );
    await airdrop(alice.publicKey);
    await airdrop(bob.publicKey);
    await airdrop(charlie.publicKey);
    return {
      alice,
      bob,
      charlie,
      stream: { address: streamAdress, bump: bump },
    };
  }

  /**
   * getBalances - Fetches the balances of Alice, Bob, and the escrow account.
   *
   * @returns {object} The balances
   */
  async function getBalances(accounts) {
    return {
      alice: await provider.connection.getBalance(accounts.alice.publicKey),
      bob: await provider.connection.getBalance(accounts.bob.publicKey),
      charlie: await provider.connection.getBalance(accounts.charlie.publicKey),
      stream: await provider.connection.getBalance(accounts.stream.address),
    };
  }

  /**
   * createStream - Issues an debt statement with Alice as issuer and Bob as debtor.
   *
   * @param {number} amount The amount to transfer per payment
   */
  async function createStream(accounts, amount) {
    await program.rpc.create(new BN(amount), accounts.stream.bump, {
      accounts: {
        stream: accounts.stream.address,
        sender: accounts.alice.publicKey,
        receiver: accounts.bob.publicKey,
        systemProgram: SystemProgram.programId,
        clock: SYSVAR_CLOCK_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
      },
      signers: [accounts.alice],
    });
  }

  it("Creates a stream", async () => {
    const accounts = await generateAccounts();
    const initialBalances = await getBalances(accounts);
    await createStream(accounts, 1234);

    // Validation
    const stream = await program.account.stream.fetch(accounts.stream.address);
    const finalBalances = await getBalances(accounts);
    assert.ok(stream.sender.toString() === accounts.alice.publicKey.toString());
    assert.ok(stream.receiver.toString() === accounts.bob.publicKey.toString());
    assert.ok(stream.amount.toString() === "1234");
    assert.ok(stream.bump === accounts.stream.bump);
    assert.ok(finalBalances.alice <= initialBalances.alice);
    assert.ok(finalBalances.bob === initialBalances.bob);
    assert.ok(finalBalances.charlie === initialBalances.charlie);
  });
});
