import { IWalletInfo, walletInfo } from '@core';

export const WalletPicker = ({ onSelect }: { onSelect: (info: IWalletInfo) => void }) => {
  const walletProvider = walletInfo();

  return (
    <>
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
    </>
  );
};
