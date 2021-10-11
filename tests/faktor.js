const assert = require("assert");
const anchor = require("@project-serum/anchor");
const solana = require("@solana/web3.js");

const { LAMPORTS_PER_SOL } = solana;
const { BN, Provider, utils } = anchor;
const { Keypair, SystemProgram, PublicKey } = anchor.web3;

describe("faktor", () => {
  // Test environment
  const provider = Provider.local();
  const program = anchor.workspace.Faktor;
  anchor.setProvider(provider);

  /**
   * generateAccounts - Generates keypairs and PDAs for participants and program accounts needed in a test case
   *
   * @returns {object} The accounts needed for a test case
   */
  async function generateAccounts() {
    const alice = Keypair.generate();
    const bob = Keypair.generate();
    const charlie = Keypair.generate();
    const dave = Keypair.generate();
    const [escrowAddress, bump] = await PublicKey.findProgramAddress(
      [
        alice.publicKey.toBuffer(),
        bob.publicKey.toBuffer(),
        charlie.publicKey.toBuffer(),
      ],
      program.programId
    );
    await airdrop(alice.publicKey);
    await airdrop(bob.publicKey);
    await airdrop(charlie.publicKey);
    await airdrop(dave.publicKey);
    return {
      alice,
      bob,
      charlie,
      dave,
      escrow: { address: escrowAddress, bump: bump },
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
      escrow: await provider.connection.getBalance(accounts.escrow.address),
    };
  }

  /**
   * issueDebt - Issues an debt statement with Alice as issuer and Bob as debtor.
   *
   * @param {number} balance The debt/collateral balance
   */
  async function issueDebt(accounts, balance) {
    const memo = `Ceci n'est pas un mémo`;
    await program.rpc.issue(accounts.escrow.bump, new BN(balance), memo, {
      accounts: {
        escrow: accounts.escrow.address,
        issuer: accounts.alice.publicKey,
        debtor: accounts.bob.publicKey,
        creditor: accounts.charlie.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [accounts.alice],
    });
  }

  it("Alice issues escrow contract", async () => {
    const accounts = await generateAccounts();
    const initialBalances = await getBalances(accounts);
    await issueDebt(accounts, 1234);

    // Validation
    const escrow = await program.account.escrow.fetch(accounts.escrow.address);
    const finalBalances = await getBalances(accounts);
    assert.ok(escrow.issuer.toString() === accounts.alice.publicKey.toString());
    assert.ok(escrow.debtor.toString() === accounts.bob.publicKey.toString());
    assert.ok(
      escrow.creditor.toString() === accounts.charlie.publicKey.toString()
    );
    assert.ok(escrow.debits.toString() === "1234");
    assert.ok(escrow.credits.toString() === "0");
    assert.ok(escrow.memo === "Ceci n'est pas un mémo");
    assert.ok(finalBalances.alice < initialBalances.alice);
    assert.ok(finalBalances.bob === initialBalances.bob);
    assert.ok(finalBalances.charlie === initialBalances.charlie);
    assert.ok(finalBalances.escrow > initialBalances.escrow);
  });

  it("Bob pays debits in part", async () => {
    const accounts = await generateAccounts();
    await issueDebt(accounts, 1234);
    const initialBalances = await getBalances(accounts);
    const amount = 1000;
    await program.rpc.pay(new BN(amount), {
      accounts: {
        escrow: accounts.escrow.address,
        issuer: accounts.alice.publicKey,
        debtor: accounts.bob.publicKey,
        creditor: accounts.charlie.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [accounts.bob],
    });

    // Validation
    const escrow = await program.account.escrow.fetch(accounts.escrow.address);
    const finalBalances = await getBalances(accounts);
    assert.ok(escrow.issuer.toString() === accounts.alice.publicKey.toString());
    assert.ok(escrow.debtor.toString() === accounts.bob.publicKey.toString());
    assert.ok(
      escrow.creditor.toString() === accounts.charlie.publicKey.toString()
    );
    assert.ok(escrow.debits.toString() === "234");
    assert.ok(escrow.credits.toString() === "1000");
    assert.ok(escrow.memo === "Ceci n'est pas un mémo");
    assert.ok(finalBalances.alice === initialBalances.alice);
    assert.ok(finalBalances.bob === initialBalances.bob - amount);
    assert.ok(finalBalances.charlie === initialBalances.charlie);
    assert.ok(finalBalances.escrow === initialBalances.escrow + amount);
  });

  it("Bob pays debits in full", async () => {
    const accounts = await generateAccounts();
    await issueDebt(accounts, 1234);
    const initialBalances = await getBalances(accounts);
    const amount = 1234;
    await program.rpc.pay(new BN(amount), {
      accounts: {
        escrow: accounts.escrow.address,
        issuer: accounts.alice.publicKey,
        debtor: accounts.bob.publicKey,
        creditor: accounts.charlie.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [accounts.bob],
    });

    // Validation
    const escrow = await program.account.escrow.fetch(accounts.escrow.address);
    const finalBalances = await getBalances(accounts);
    assert.ok(escrow.issuer.toString() === accounts.alice.publicKey.toString());
    assert.ok(escrow.debtor.toString() === accounts.bob.publicKey.toString());
    assert.ok(
      escrow.creditor.toString() === accounts.charlie.publicKey.toString()
    );
    assert.ok(escrow.credits.toString() === "1234");
    assert.ok(escrow.debits.toString() === "0");
    assert.ok(escrow.memo === "Ceci n'est pas un mémo");
    assert.ok(finalBalances.alice === initialBalances.alice);
    assert.ok(finalBalances.bob === initialBalances.bob - amount);
    assert.ok(finalBalances.charlie === initialBalances.charlie);
    assert.ok(finalBalances.escrow === initialBalances.escrow + amount);
  });

  it("Charlie collects credits", async () => {
    const accounts = await generateAccounts();
    await issueDebt(accounts, 1234);
    const amount = 1000;
    await program.rpc.pay(new BN(amount), {
      accounts: {
        escrow: accounts.escrow.address,
        issuer: accounts.alice.publicKey,
        debtor: accounts.bob.publicKey,
        creditor: accounts.charlie.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [accounts.bob],
    });
    const initialBalances = await getBalances(accounts);
    await program.rpc.collect(new BN(amount), {
      accounts: {
        escrow: accounts.escrow.address,
        issuer: accounts.alice.publicKey,
        debtor: accounts.bob.publicKey,
        creditor: accounts.charlie.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [accounts.charlie],
    });

    // Validation
    const escrow = await program.account.escrow.fetch(accounts.escrow.address);
    const finalBalances = await getBalances(accounts);
    assert.ok(escrow.issuer.toString() === accounts.alice.publicKey.toString());
    assert.ok(escrow.debtor.toString() === accounts.bob.publicKey.toString());
    assert.ok(
      escrow.creditor.toString() === accounts.charlie.publicKey.toString()
    );
    assert.ok(escrow.credits.toString() === "0");
    assert.ok(escrow.debits.toString() === "234");
    assert.ok(escrow.memo === "Ceci n'est pas un mémo");
    assert.ok(finalBalances.alice === initialBalances.alice);
    assert.ok(finalBalances.bob === initialBalances.bob);
    assert.ok(finalBalances.charlie === initialBalances.charlie + amount);
    assert.ok(finalBalances.escrow === initialBalances.escrow - amount);
  });
});
