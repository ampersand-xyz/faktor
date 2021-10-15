import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const ConnectWalletView = () => {
  return (
    <div className="flex justify-center pt-24">
      <WalletMultiButton />
    </div>
  );
};
