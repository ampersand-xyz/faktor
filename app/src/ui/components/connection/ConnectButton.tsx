import { useAppStore } from '@stores';

export const ConnectButton = () => {
  const { setWalletPickerOpen, walletBusy } = useAppStore();

  const handleClick = () => {
    setWalletPickerOpen(true);
  };

  let text = 'Loading...';
  if (!walletBusy) {
    text = 'Connect Your Wallet';
  }

  return (
    <button
      className="flex items-center justify-center p-5 bg-none text-gray-700 hover:text-gray-900"
      onClick={handleClick}
    >
      {text}
    </button>
  );
};
