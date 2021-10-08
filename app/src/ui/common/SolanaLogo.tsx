import { SOLANA_LOGO_URL } from '@core';

export const SolanaLogo = ({ size = 12 }: { size?: number }) => {
  const className = `h-${size}`;
  return <img src={SOLANA_LOGO_URL} className={className} />;
};
