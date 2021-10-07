import { createWallet, IWalletInfo } from '@core';
import { useAppContext } from '@stores';
import { useOnClickOutside } from '@ui/hooks';
import React, { HTMLAttributes, useCallback, useRef, useState } from 'react';
import { WalletPicker } from './WalletPicker';

export const Button: React.FC<HTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => {
  return (
    <button
      className="flex items-center justify-center p-5 bg-none text-gray-100 hover:text-white font-semibold"
      {...props}
    >
      {children}
    </button>
  );
};

export const WalletConnector = () => {
  const { disconnectWallet, connectWallet, connected, cluster } = useAppContext();

  const [walletPickerOpen, setWalletPickerOpen] = useState(false);

  const openWalletPicker = useCallback(() => {
    setWalletPickerOpen(true);
  }, []);

  const closeWalletPicker = useCallback(() => {
    setWalletPickerOpen(false);
  }, []);

  const handleSelectWallet = (walletInfo: IWalletInfo) => {
    const selectedWallet = createWallet(walletInfo.id, cluster.id);
    connectWallet(selectedWallet);
    closeWalletPicker();
  };

  const pickerRef = useRef(null);

  useOnClickOutside(pickerRef, closeWalletPicker);

  return (
    <div>
      {connected ? (
        <Button onClick={disconnectWallet}>Disconnect Wallet</Button>
      ) : (
        <Button onClick={openWalletPicker}>Connect Wallet</Button>
      )}
      {walletPickerOpen && (
        <div ref={pickerRef}>
          <button onClick={closeWalletPicker}>
            <span>X</span>
          </button>
          <WalletPicker onSelect={handleSelectWallet} />
        </div>
      )}
    </div>
  );
};
