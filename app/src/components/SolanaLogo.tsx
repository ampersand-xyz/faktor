import { useMemo } from 'react';

export const SOLANA_LOGO_URL =
  'https://cryptologos.cc/logos/solana-sol-logo.svg?v=010';

export function SolanaLogo({ size }: { size: number }) {
  const height = useMemo(() => Math.floor(size / 12), [size]);

  return (
    <div className="flex items-center justify-center p-3 rounded-full bg-gray-100">
      <img
        alt="Token icon"
        src={SOLANA_LOGO_URL}
        className="object-cover m-auto"
        style={{ height: `${height}rem` }}
      />
    </div>
  );
}
