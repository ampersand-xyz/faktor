import { IWalletInfo, walletInfo } from '@core';

export const WalletPicker = function _WalletPicker({
  open,
  onSelect,
  onClose
}: {
  open: boolean;
  onSelect: (info: IWalletInfo) => void;
  onClose: () => void;
}) {
  if (!open) {
    return null;
  }

  const walletProvider = walletInfo();

  return (
    <div className="wallet-picker-modal">
      <button onClick={onClose}>
        <span>X</span>
      </button>
      <ul>
        {walletProvider.map((item) => {
          return (
            <li key={`wallet-${item.name}`}>
              <button onClick={() => onSelect(item)}>
                <img src={item.icon} />
                <span>{item.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
