const assert = require("assert");
const anchor = require("@project-serum/anchor");
const solana = require("@solana/web3.js");

const { LAMPORTS_PER_SOL, SYSVAR_CLOCK_PUBKEY, SYSVAR_RENT_PUBKEY } = solana;
const { BN, Provider } = anchor;
const { SystemProgram, Keypair } = anchor.web3;

describe("cashflow", () => {
  // Test environment
  const provider = Provider.local();
  const alice = Keypair.generate();
  const bob = Keypair.generate();
  const program = anchor.workspace.Cashflow;
  anchor.setProvider(provider);

  /**
   * createCashflow - Issues an debt statement with Alice as issuer and Bob as debtor.
   *
   * @param {number} amount The amount to transfer per payment
   */
  async function createCashflow(amount) {
    const cashflow = Keypair.generate();
    await program.rpc.create(new BN(amount), {
      accounts: {
        cashflow: cashflow.publicKey,
        sender: alice.publicKey,
        receiver: bob.publicKey,
        systemProgram: SystemProgram.programId,
        clock: SYSVAR_CLOCK_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
      },
      signers: [cashflow, alice],
    });
    return cashflow.publicKey;
  }

  /**
   * getBalances - Fetches the balances of Alice, Bob, and the escrow account.
   *
   * @returns {object} The balances
   */
  async function getBalances(cashflowPubkey) {
    return {
      alice: await provider.connection.getBalance(alice.publicKey),
      bob: await provider.connection.getBalance(bob.publicKey),
      cashflow: cashflowPubkey
        ? await provider.connection.getBalance(cashflowPubkey)
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

  it("Creates a cashflow", async () => {
    const initialBalances = await getBalances(null);
    const cashflowPubkey = await createCashflow(1234);

    // Validation
    const cashflow = await program.account.cashflow.fetch(cashflowPubkey);
    const finalBalances = await getBalances(cashflowPubkey);
    assert.ok(cashflow.sender.toString() === alice.publicKey.toString());
    assert.ok(cashflow.receiver.toString() === bob.publicKey.toString());
    assert.ok(cashflow.amount.toString() === "1234");
    assert.ok(finalBalances.alice <= initialBalances.alice);
    assert.ok(finalBalances.bob === initialBalances.bob);
  });
});
