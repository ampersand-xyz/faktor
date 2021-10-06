import { WalletPicker } from '@components/wallet';
import { useAppStore } from '@stores';

export const Home = () => {
  const { walletPublicKey, walletPickerOpen, setWalletPickerOpen } = useAppStore();

  return (
    <>
      <WalletPicker
        open={walletPickerOpen}
        onSelect={() => setWalletPickerOpen(false)}
        onClose={() => setWalletPickerOpen(false)}
      />
      <div>
        <h1 color="text-gray-900">Home</h1>
      </div>
      <div>
        <h3>{walletPublicKey?.toBase58() ?? 'No connected wallet found.'}</h3>
      </div>
    </>
  );
};
