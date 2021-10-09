import { IWalletInfo, walletInfo } from '@core/wallet/wallet';
import { useOnClickOutside } from '@ui/hooks';
import { useRef } from 'react';

export const WalletPicker = ({
  onSelect,
  onClickOutside
}: {
  onSelect: (info: IWalletInfo) => void;
  onClickOutside: () => void;
}) => {
  const walletProvider = walletInfo();

  const pickerRef = useRef(null);

  useOnClickOutside(pickerRef, onClickOutside);

  return (
    <div ref={pickerRef}>
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
