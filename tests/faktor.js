const assert = require("assert");
const anchor = require("@project-serum/anchor");
const solana = require("@solana/web3.js");

const { LAMPORTS_PER_SOL } = solana;
const { BN, Provider } = anchor;
const { SystemProgram, Keypair } = anchor.web3;

describe("faktor", () => {
  // Setup test environment
  const provider = Provider.local();
  const alice = Keypair.generate();
  const bob = Keypair.generate();
  const program = anchor.workspace.Faktor;
  anchor.setProvider(provider);

  /**
   * Helper function to issuing an invoice from Alice to Bob.
   *
   * @param {number} amount - The invoice amount
   */
  async function issueInvoice(amount) {
    const invoice = Keypair.generate();
    const bnAmount = new BN(amount);
    await program.rpc.issueInvoice(bnAmount, {
      accounts: {
        invoice: invoice.publicKey,
        issuer: alice.publicKey,
        payer: bob.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [invoice, alice],
    });
    return invoice.publicKey;
  }

  // Airdrop SOL to Alice and Bob
  before(async () => {
    await provider.connection
      .requestAirdrop(alice.publicKey, LAMPORTS_PER_SOL)
      .then((sig) => provider.connection.confirmTransaction(sig, "confirmed"));
    await provider.connection
      .requestAirdrop(bob.publicKey, LAMPORTS_PER_SOL)
      .then((sig) => provider.connection.confirmTransaction(sig, "confirmed"));
  });

  it("Issues an invoice", async () => {
    const invoicePubkey = await issueInvoice(1234);

    // Validation
    const invoice = await program.account.invoice.fetch(invoicePubkey);
    assert.ok(invoice.initialAmount.toString() == "1234");
    assert.ok(invoice.remainingAmount.toString() == "1234");
    assert.ok(invoice.issuer.toString() == alice.publicKey);
    assert.ok(invoice.payer.toString() == bob.publicKey);
  });

  it("Partially pays an invoice", async () => {
    const invoicePubkey = await issueInvoice(1234);
    const aliceInitialBalance = await provider.connection.getBalance(
      alice.publicKey
    );
    const bobInitialBalance = await provider.connection.getBalance(
      bob.publicKey
    );
    const amount = 1000;
    await program.rpc.payInvoice(new BN(amount), {
      accounts: {
        invoice: invoicePubkey,
        issuer: alice.publicKey,
        payer: bob.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [bob],
    });

    // Validation
    const invoice = await program.account.invoice.fetch(invoicePubkey);
    assert.ok(invoice.initialAmount.toString() == "1234");
    assert.ok(invoice.remainingAmount.toString() == "234");
    assert.ok(invoice.issuer.toString() == alice.publicKey);
    assert.ok(invoice.payer.toString() == bob.publicKey);
    const aliceFinalBalance = await provider.connection.getBalance(
      alice.publicKey
    );
    const bobFinalBalance = await provider.connection.getBalance(bob.publicKey);
    assert.ok(aliceFinalBalance === aliceInitialBalance + amount);
    assert.ok(bobFinalBalance === bobInitialBalance - amount);
  });

  it("Pays an invoice in full", async () => {
    const invoicePubkey = await issueInvoice(1234);
    const aliceInitialBalance = await provider.connection.getBalance(
      alice.publicKey
    );
    const bobInitialBalance = await provider.connection.getBalance(
      bob.publicKey
    );
    await program.rpc.payInvoice(new BN(1234), {
      accounts: {
        invoice: invoicePubkey,
        issuer: alice.publicKey,
        payer: bob.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [bob],
    });

    // Validation
    const invoice = await program.account.invoice.fetch(invoicePubkey);
    assert.ok(invoice.initialAmount.toString() == "1234");
    assert.ok(invoice.remainingAmount.toString() == "0");
    assert.ok(invoice.issuer.toString() == alice.publicKey);
    assert.ok(invoice.payer.toString() == bob.publicKey);
    const aliceFinalBalance = await provider.connection.getBalance(
      alice.publicKey
    );
    const bobFinalBalance = await provider.connection.getBalance(bob.publicKey);
    assert.ok(aliceFinalBalance === aliceInitialBalance + 1234);
    assert.ok(bobFinalBalance === bobInitialBalance - 1234);
  });

  it("Voids an invoice", async () => {
    const invoicePubkey = await issueInvoice(1234);
    await program.rpc.voidInvoice({
      accounts: {
        invoice: invoicePubkey,
        issuer: alice.publicKey,
      },
      signers: [alice],
    });

    // Validation
    const invoice = await program.account.invoice.fetch(invoicePubkey);
    assert.ok(invoice.initialAmount.toString() == "1234");
    assert.ok(invoice.remainingAmount.toString() == "0");
    assert.ok(invoice.issuer.toString() == alice.publicKey);
    assert.ok(invoice.payer.toString() == bob.publicKey);
  });
});
