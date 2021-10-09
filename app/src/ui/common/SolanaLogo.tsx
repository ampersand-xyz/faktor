const SOLANA_LOGO_URL = 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=010';

export const SolanaLogo = ({ size = 12 }: { size?: number }) => {
  const className = `h-${size}`;
  return <img src={SOLANA_LOGO_URL} className={className} />;
};
