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
   * openInvoice - Opens an invoice with Alice as issuer and Bob as debtor.
   *
   * @param {number} balance The invoice balance
   */
  async function openInvoice(balance) {
    const invoice = Keypair.generate();
    const memo = `For the wild ones.`;
    await program.rpc.open(new BN(balance), memo, {
      accounts: {
        invoice: invoice.publicKey,
        issuer: alice.publicKey,
        debtor: bob.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [invoice, alice],
    });
    return invoice.publicKey;
  }

  /**
   * getBalances - Fetches the balances of Alice, Bob, and Charlie.
   *
   * @returns {object} The balances
   */
  async function getBalances(invoicePubkey) {
    return {
      alice: await provider.connection.getBalance(alice.publicKey),
      bob: await provider.connection.getBalance(bob.publicKey),
      invoice: invoicePubkey
        ? await provider.connection.getBalance(invoicePubkey)
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

  it("Opens an invoice", async () => {
    const initialBalances = await getBalances();
    const invoicePubkey = await openInvoice(1234);

    // Validation
    const invoice = await program.account.invoice.fetch(invoicePubkey);
    const finalBalances = await getBalances(invoicePubkey);
    assert.ok(invoice.status.open !== undefined);
    assert.ok(invoice.issuer.toString() === alice.publicKey.toString());
    assert.ok(invoice.collateral.toString() === "1234");
    assert.ok(invoice.debtor.toString() === bob.publicKey.toString());
    assert.ok(invoice.debt.toString() === "1234");
    assert.ok(invoice.memo === "For the wild ones.");
    assert.ok(finalBalances.alice <= initialBalances.alice - 1234);
    assert.ok(finalBalances.bob === initialBalances.bob);
    assert.ok(finalBalances.invoice >= initialBalances.invoice + 1234);
  });

  it("Pays an invoice in part", async () => {
    const invoicePubkey = await openInvoice(1234, null);
    const initialBalances = await getBalances(invoicePubkey);
    const amount = 1000;
    await program.rpc.pay(new BN(amount), {
      accounts: {
        invoice: invoicePubkey,
        debtor: bob.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [bob],
    });

    // Validation
    const invoice = await program.account.invoice.fetch(invoicePubkey);
    const finalBalances = await getBalances(invoicePubkey);
    assert.ok(invoice.status.open !== undefined);
    assert.ok(invoice.issuer.toString() === alice.publicKey.toString());
    assert.ok(invoice.collateral.toString() === "2234");
    assert.ok(invoice.debtor.toString() === bob.publicKey.toString());
    assert.ok(invoice.debt.toString() === "234");
    assert.ok(invoice.memo === "For the wild ones.");
    assert.ok(finalBalances.alice === initialBalances.alice);
    assert.ok(finalBalances.bob === initialBalances.bob - amount);
    assert.ok(finalBalances.invoice === initialBalances.invoice + amount);
  });

  it("Pays an invoice in full", async () => {
    const invoicePubkey = await openInvoice(1234, null);
    const initialBalances = await getBalances(invoicePubkey);
    const amount = 1234;
    await program.rpc.pay(new BN(amount), {
      accounts: {
        invoice: invoicePubkey,
        debtor: bob.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [bob],
    });

    // Validation
    const invoice = await program.account.invoice.fetch(invoicePubkey);
    const finalBalances = await getBalances(invoicePubkey);
    assert.ok(invoice.status.paid !== undefined);
    assert.ok(invoice.issuer.toString() === alice.publicKey.toString());
    assert.ok(invoice.collateral.toString() === "2468");
    assert.ok(invoice.debtor.toString() === bob.publicKey.toString());
    assert.ok(invoice.debt.toString() === "0");
    assert.ok(invoice.memo === "For the wild ones.");
    assert.ok(finalBalances.alice === initialBalances.alice);
    assert.ok(finalBalances.bob === initialBalances.bob - amount);
    assert.ok(finalBalances.invoice === initialBalances.invoice + amount);
  });

  // it("Pays an invoice in full", async () => {
  //   const amount = 1234;
  //   const invoicePubkey = await openInvoice(amount, null);
  //   const initialBalances = await getBalances();
  //   await program.rpc.payInvoice(new BN(amount), {
  //     accounts: {
  //       invoice: invoicePubkey,
  //       debtor: bob.publicKey,
  //       collector: charlie.publicKey,
  //       systemProgram: SystemProgram.programId,
  //     },
  //     signers: [bob],
  //   });

  //   // Validation
  //   const invoice = await program.account.invoice.fetch(invoicePubkey);
  //   const finalBalances = await getBalances();
  //   assert.ok(invoice.issuer.toString() === alice.publicKey.toString());
  //   assert.ok(invoice.debtor.toString() === bob.publicKey.toString());
  //   assert.ok(invoice.collector.toString() === charlie.publicKey.toString());
  //   assert.ok(invoice.initialDebt.toString() === "1234");
  //   assert.ok(invoice.paidDebt.toString() === "1234");
  //   assert.ok(invoice.remainingDebt.toString() === "0");
  //   assert.ok(invoice.memo === "For the crazy ones.");
  //   assert.ok(invoice.status.paid !== undefined);
  //   assert.ok(finalBalances.alice === initialBalances.alice);
  //   assert.ok(finalBalances.bob === initialBalances.bob - amount);
  //   assert.ok(finalBalances.chalie === initialBalances.chalie + amount);
  // });

  // it("Rejects an invoice", async () => {
  //   const invoicePubkey = await openInvoice(1234, null);
  //   const initialBalances = await getBalances();
  //   await program.rpc.rejectInvoice(false, {
  //     accounts: {
  //       invoice: invoicePubkey,
  //       debtor: bob.publicKey,
  //     },
  //     signers: [bob],
  //   });

  //   // Validation
  //   const invoice = await program.account.invoice.fetch(invoicePubkey);
  //   const finalBalances = await getBalances();
  //   assert.ok(invoice.issuer.toString() === alice.publicKey.toString());
  //   assert.ok(invoice.debtor.toString() === bob.publicKey.toString());
  //   assert.ok(invoice.collector.toString() === charlie.publicKey.toString());
  //   assert.ok(invoice.initialDebt.toString() === "1234");
  //   assert.ok(invoice.paidDebt.toString() === "0");
  //   assert.ok(invoice.remainingDebt.toString() === "0");
  //   assert.ok(invoice.memo === "For the crazy ones.");
  //   assert.ok(invoice.status.rejected !== undefined);
  //   assert.ok(finalBalances.alice === initialBalances.alice);
  //   assert.ok(finalBalances.bob === initialBalances.bob);
  //   assert.ok(finalBalances.chalie === initialBalances.chalie);
  // });

  // it("Rejects an invoice as spam", async () => {
  //   const invoicePubkey = await openInvoice(1234, null);
  //   const initialBalances = await getBalances();
  //   await program.rpc.rejectInvoice(true, {
  //     accounts: {
  //       invoice: invoicePubkey,
  //       debtor: bob.publicKey,
  //     },
  //     signers: [bob],
  //   });

  //   // Validation
  //   const invoice = await program.account.invoice.fetch(invoicePubkey);
  //   const finalBalances = await getBalances();
  //   assert.ok(invoice.issuer.toString() === alice.publicKey.toString());
  //   assert.ok(invoice.debtor.toString() === bob.publicKey.toString());
  //   assert.ok(invoice.collector.toString() === charlie.publicKey.toString());
  //   assert.ok(invoice.initialDebt.toString() === "1234");
  //   assert.ok(invoice.paidDebt.toString() === "0");
  //   assert.ok(invoice.remainingDebt.toString() === "0");
  //   assert.ok(invoice.memo === "For the crazy ones.");
  //   assert.ok(invoice.status.spam !== undefined);
  //   assert.ok(finalBalances.alice === initialBalances.alice);
  //   assert.ok(finalBalances.bob === initialBalances.bob);
  //   assert.ok(finalBalances.chalie === initialBalances.chalie);
  // });

  // it("Voids an invoice", async () => {
  //   const invoicePubkey = await openInvoice(1234, null);
  //   const initialBalances = await getBalances();
  //   await program.rpc.voidInvoice({
  //     accounts: {
  //       invoice: invoicePubkey,
  //       issuer: alice.publicKey,
  //     },
  //     signers: [alice],
  //   });

  //   // Validation
  //   const invoice = await program.account.invoice.fetch(invoicePubkey);
  //   const finalBalances = await getBalances();
  //   assert.ok(invoice.issuer.toString() === alice.publicKey.toString());
  //   assert.ok(invoice.debtor.toString() === bob.publicKey.toString());
  //   assert.ok(invoice.collector.toString() === charlie.publicKey.toString());
  //   assert.ok(invoice.initialDebt.toString() === "1234");
  //   assert.ok(invoice.paidDebt.toString() === "0");
  //   assert.ok(invoice.remainingDebt.toString() === "0");
  //   assert.ok(invoice.memo === "For the crazy ones.");
  //   assert.ok(invoice.status.void !== undefined);
  //   assert.ok(finalBalances.alice === initialBalances.alice);
  //   assert.ok(finalBalances.bob === initialBalances.bob);
  //   assert.ok(finalBalances.chalie === initialBalances.chalie);
  // });
});
