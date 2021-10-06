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
  const charlie = Keypair.generate();
  const program = anchor.workspace.Faktor;
  anchor.setProvider(provider);

  /**
   * issueInvoice - Issues an invoice from Alice (issuer)
   *   to Bob (debtor) to be collected by Charlie (collector).
   *
   * @param {number} amount The invoice amount
   * @param {PublicKey} collector An optional address to collect payments at
   */
  async function issueInvoice(amount) {
    const invoice = Keypair.generate();
    const bnAmount = new BN(amount);
    const memo = `Please pay me ${amount} SOL!`;
    await program.rpc.issueInvoice(bnAmount, memo, {
      accounts: {
        invoice: invoice.publicKey,
        issuer: alice.publicKey,
        debtor: bob.publicKey,
        collector: charlie.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [invoice, alice],
    });
    return invoice.publicKey;
  }

  /**
   * getBalances - Fetch the balances of Alice, Bob, and Charlie.
   *
   * @returns {object} The balances
   */
  async function getBalances() {
    return {
      alice: await provider.connection.getBalance(alice.publicKey),
      bob: await provider.connection.getBalance(bob.publicKey),
      chalie: await provider.connection.getBalance(charlie.publicKey),
    };
  }

  /**
   * airdrop - Airdrop SOL to an account.
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
    await airdrop(charlie.publicKey);
  });

  it("Issues an invoice", async () => {
    const initialBalances = await getBalances();
    const invoicePubkey = await issueInvoice(1234);

    // Validation
    const invoice = await program.account.invoice.fetch(invoicePubkey);
    const finalBalances = await getBalances();
    assert.ok(invoice.issuer.toString() === alice.publicKey.toString());
    assert.ok(invoice.debtor.toString() === bob.publicKey.toString());
    assert.ok(invoice.collector.toString() === charlie.publicKey.toString());
    assert.ok(invoice.initialDebt.toString() === "1234");
    assert.ok(invoice.remainingDebt.toString() === "1234");
    assert.ok(invoice.memo === "Please pay me 1234 SOL!");
    assert.ok(finalBalances.alice < initialBalances.alice);
    assert.ok(finalBalances.bob === initialBalances.bob);
    assert.ok(finalBalances.chalie === initialBalances.chalie);
  });

  it("Pays an invoice in full", async () => {
    const amount = 1234;
    const invoicePubkey = await issueInvoice(amount, null);
    const initialBalances = await getBalances();
    await program.rpc.payInvoice(new BN(amount), {
      accounts: {
        invoice: invoicePubkey,
        debtor: bob.publicKey,
        collector: charlie.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [bob],
    });

    // Validation
    const invoice = await program.account.invoice.fetch(invoicePubkey);
    const finalBalances = await getBalances();
    assert.ok(invoice.issuer.toString() === alice.publicKey.toString());
    assert.ok(invoice.debtor.toString() === bob.publicKey.toString());
    assert.ok(invoice.collector.toString() === charlie.publicKey.toString());
    assert.ok(invoice.initialDebt.toString() === "1234");
    assert.ok(invoice.remainingDebt.toString() === "0");
    assert.ok(invoice.memo === "Please pay me 1234 SOL!");
    assert.ok(finalBalances.alice === initialBalances.alice);
    assert.ok(finalBalances.bob === initialBalances.bob - amount);
    assert.ok(finalBalances.chalie === initialBalances.chalie + amount);
  });

  it("Pays an invoice in part", async () => {
    const invoicePubkey = await issueInvoice(1234, null);
    const initialBalances = await getBalances();
    const amount = 1000;
    await program.rpc.payInvoice(new BN(amount), {
      accounts: {
        invoice: invoicePubkey,
        debtor: bob.publicKey,
        collector: charlie.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [bob],
    });

    // Validation
    const invoice = await program.account.invoice.fetch(invoicePubkey);
    const finalBalances = await getBalances();
    assert.ok(invoice.issuer.toString() === alice.publicKey.toString());
    assert.ok(invoice.debtor.toString() === bob.publicKey.toString());
    assert.ok(invoice.collector.toString() === charlie.publicKey.toString());
    assert.ok(invoice.initialDebt.toString() === "1234");
    assert.ok(invoice.remainingDebt.toString() === "234");
    assert.ok(invoice.memo === "Please pay me 1234 SOL!");
    assert.ok(finalBalances.alice === initialBalances.alice);
    assert.ok(finalBalances.bob === initialBalances.bob - amount);
    assert.ok(finalBalances.chalie === initialBalances.chalie + amount);
  });

  it("Voids an invoice", async () => {
    const invoicePubkey = await issueInvoice(1234, null);
    const initialBalances = await getBalances();
    await program.rpc.voidInvoice({
      accounts: {
        invoice: invoicePubkey,
        issuer: alice.publicKey,
      },
      signers: [alice],
    });

    // Validation
    const invoice = await program.account.invoice.fetch(invoicePubkey);
    const finalBalances = await getBalances();
    assert.ok(invoice.issuer.toString() === alice.publicKey.toString());
    assert.ok(invoice.debtor.toString() === bob.publicKey.toString());
    assert.ok(invoice.collector.toString() === charlie.publicKey.toString());
    assert.ok(invoice.initialDebt.toString() === "1234");
    assert.ok(invoice.remainingDebt.toString() === "0");
    assert.ok(invoice.memo === "Please pay me 1234 SOL!");
    assert.ok(finalBalances.alice === initialBalances.alice);
    assert.ok(finalBalances.bob === initialBalances.bob);
    assert.ok(finalBalances.chalie === initialBalances.chalie);
  });
});
