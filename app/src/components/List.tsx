import { ReactNode } from 'react';

export function List({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <ul className={`flex flex-col gap-3 flex-grow ${className}`}>{children}</ul>;
}
