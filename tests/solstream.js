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
    const [streamAddress, streamBump] = await PublicKey.findProgramAddress(
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
      stream: { address: streamAddress, bump: streamBump },
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
   * createStream - Creates a payment stream from Alice to Bob.
   *
   * @param {number} amount The amount to transfer per payment
   */
  async function createStream(accounts, amount, interval, balance) {
    await program.rpc.createStream(
      new BN(amount),
      new BN(interval),
      new BN(balance),
      accounts.stream.bump,
      {
        accounts: {
          stream: accounts.stream.address,
          sender: accounts.alice.publicKey,
          receiver: accounts.bob.publicKey,
          systemProgram: SystemProgram.programId,
          clock: SYSVAR_CLOCK_PUBKEY,
          rent: SYSVAR_RENT_PUBKEY,
        },
        signers: [accounts.alice],
      }
    );
  }

  it("Creates a stream", async () => {
    // Setup
    const accounts = await generateAccounts();

    // Test
    const amount = 1234;
    const interval = 10;
    const balance = 10000;
    const initialBalances = await getBalances(accounts);
    await createStream(accounts, amount, interval, balance);

    // Validate
    const stream = await program.account.stream.fetch(accounts.stream.address);
    const finalBalances = await getBalances(accounts);
    assert.ok(stream.sender.toString() === accounts.alice.publicKey.toString());
    assert.ok(stream.receiver.toString() === accounts.bob.publicKey.toString());
    assert.ok(stream.amount.toString() === "1234");
    assert.ok(stream.interval.toString() === "10");
    assert.ok(stream.bump === accounts.stream.bump);
    assert.ok(finalBalances.alice <= initialBalances.alice - balance);
    assert.ok(finalBalances.bob === initialBalances.bob);
    assert.ok(finalBalances.charlie === initialBalances.charlie);
    assert.ok(finalBalances.stream >= initialBalances.stream + balance);
  });

  it("Processes stream", async () => {
    // Setup
    const accounts = await generateAccounts();
    const amount = 1234;
    const interval = 10;
    const balance = 10000;
    await createStream(accounts, amount, interval, balance);

    // Test
    const initialBalances = await getBalances(accounts);
    await program.rpc.processStream({
      accounts: {
        stream: accounts.stream.address,
        signer: accounts.charlie.publicKey,
        sender: accounts.alice.publicKey,
        receiver: accounts.bob.publicKey,
        systemProgram: SystemProgram.programId,
        clock: SYSVAR_CLOCK_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
      },
      signers: [accounts.charlie],
    });

    // Validate
    const bounty = 500;
    const stream = await program.account.stream.fetch(accounts.stream.address);
    const finalBalances = await getBalances(accounts);
    assert.ok(stream.sender.toString() === accounts.alice.publicKey.toString());
    assert.ok(stream.receiver.toString() === accounts.bob.publicKey.toString());
    assert.ok(stream.amount.toString() === "1234");
    assert.ok(stream.interval.toString() === "10");
    assert.ok(stream.bump === accounts.stream.bump);
    assert.ok(finalBalances.alice === initialBalances.alice);
    assert.ok(finalBalances.bob === initialBalances.bob + amount);
    assert.ok(finalBalances.charlie === initialBalances.charlie + bounty);
    assert.ok(
      finalBalances.stream === initialBalances.stream - bounty - amount
    );
  });
});
