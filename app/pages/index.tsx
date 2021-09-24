import Head from "next/head";

import {
  getLedgerWallet,
  getMathWallet,
  getPhantomWallet,
  getSolflareWallet,
  getSolletWallet,
  getSolongWallet,
  getTorusWallet,
} from "@solana/wallet-adapter-wallets";
import { useMemo } from "react";

export default function Home() {
  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSolflareWallet(),
      getLedgerWallet(),
      getSolletWallet(),
    ],
    []
  );

  return (
    <div className="h-screen">
      <Head>
        <title>Faktor</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="px-4 py-0">
        <h1 className="text-black">Faktor</h1>
      </main>
    </div>
  );
}
