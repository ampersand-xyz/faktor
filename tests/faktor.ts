import anchor from "@project-serum/anchor";

describe("faktor", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  it("Is initialized!", async () => {
    // Add your test here.
    const program = anchor.workspace.Faktor;
    const tx = await program.rpc.initialize();
    console.log("Your transaction signature", tx);
  });
});
