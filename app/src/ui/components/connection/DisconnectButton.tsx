import { useAppStore } from '@stores';

export const DisconnectButton = () => {
  const { walletBusy, disconnectWallet } = useAppStore();

  const handleClick = () => {
    disconnectWallet && disconnectWallet();
  };

  let text = 'Loading...';
  if (!walletBusy) {
    text = 'Disconnect Wallet';
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
