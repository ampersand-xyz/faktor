const assert = require("assert");
const anchor = require("@project-serum/anchor");
const solana = require("@solana/web3.js");

const { LAMPORTS_PER_SOL } = solana;
const { BN, Provider } = anchor;
const { SystemProgram, Keypair } = anchor.web3;

describe("faktor", () => {
  // Test environment
  const provider = Provider.local();
  const alice = Keypair.generate();
  const bob = Keypair.generate();
  const program = anchor.workspace.Faktor;
  anchor.setProvider(provider);

  /**
   * issueDebt - Issues an debt statement with Alice as issuer and Bob as debtor.
   *
   * @param {number} balance The debt/collateral balance
   */
  async function issueDebt(balance) {
    const escrow = Keypair.generate();
    const memo = `For the wild ones.`;
    await program.rpc.issue(new BN(balance), memo, {
      accounts: {
        escrow: escrow.publicKey,
        issuer: alice.publicKey,
        debtor: bob.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [escrow, alice],
    });
    return escrow.publicKey;
  }

  /**
   * getBalances - Fetches the balances of Alice, Bob, and the escrow account.
   *
   * @returns {object} The balances
   */
  async function getBalances(escrowPubkey) {
    return {
      alice: await provider.connection.getBalance(alice.publicKey),
      bob: await provider.connection.getBalance(bob.publicKey),
      escrow: escrowPubkey
        ? await provider.connection.getBalance(escrowPubkey)
        : 0,
    };
  }

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

  // Airdrop SOL to Alice and Bob
  before(async () => {
    await airdrop(alice.publicKey);
    await airdrop(bob.publicKey);
  });

  it("Issues debt", async () => {
    const initialBalances = await getBalances();
    const escrowPubkey = await issueDebt(1234);

    // Validation
    const escrow = await program.account.escrow.fetch(escrowPubkey);
    const finalBalances = await getBalances(escrowPubkey);
    assert.ok(escrow.issuer.toString() === alice.publicKey.toString());
    assert.ok(escrow.debtor.toString() === bob.publicKey.toString());
    assert.ok(escrow.collateralBalance.toString() === "1234");
    assert.ok(escrow.debtBalance.toString() === "1234");
    assert.ok(escrow.memo === "For the wild ones.");
    assert.ok(finalBalances.alice <= initialBalances.alice - 1234);
    assert.ok(finalBalances.bob === initialBalances.bob);
    assert.ok(finalBalances.escrow >= initialBalances.escrow + 1234);
  });

  it("Pays debt in part", async () => {
    const escrowPubkey = await issueDebt(1234, null);
    const initialBalances = await getBalances(escrowPubkey);
    const amount = 1000;
    await program.rpc.pay(new BN(amount), {
      accounts: {
        escrow: escrowPubkey,
        debtor: bob.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [bob],
    });

    // Validation
    const escrow = await program.account.escrow.fetch(escrowPubkey);
    const finalBalances = await getBalances(escrowPubkey);
    assert.ok(escrow.issuer.toString() === alice.publicKey.toString());
    assert.ok(escrow.debtor.toString() === bob.publicKey.toString());
    assert.ok(escrow.collateralBalance.toString() === "2234");
    assert.ok(escrow.debtBalance.toString() === "234");
    assert.ok(escrow.memo === "For the wild ones.");
    assert.ok(finalBalances.alice === initialBalances.alice);
    assert.ok(finalBalances.bob === initialBalances.bob - amount);
    assert.ok(finalBalances.escrow === initialBalances.escrow + amount);
  });

  it("Pays debt in full", async () => {
    const escrowPubkey = await issueDebt(1234, null);
    const initialBalances = await getBalances(escrowPubkey);
    const amount = 1234;
    await program.rpc.pay(new BN(amount), {
      accounts: {
        escrow: escrowPubkey,
        debtor: bob.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [bob],
    });

    // Validation
    const escrow = await program.account.escrow.fetch(escrowPubkey);
    const finalBalances = await getBalances(escrowPubkey);
    assert.ok(escrow.issuer.toString() === alice.publicKey.toString());
    assert.ok(escrow.debtor.toString() === bob.publicKey.toString());
    assert.ok(escrow.collateralBalance.toString() === "2468");
    assert.ok(escrow.debtBalance.toString() === "0");
    assert.ok(escrow.memo === "For the wild ones.");
    assert.ok(finalBalances.alice === initialBalances.alice);
    assert.ok(finalBalances.bob === initialBalances.bob - amount);
    assert.ok(finalBalances.escrow === initialBalances.escrow + amount);
  });
});
