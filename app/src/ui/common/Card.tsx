import { ReactNode } from 'react';

export const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <div
      className={`${className} px-4 min-w-card max-w-7xl py-3 my-auto flex flex-col justify-around rounded-lg text-left overflow-hidden transform transition-all`}
    >
      {children}
    </div>
  );
};

Card.Header = function CardHeader({ children }: { children: ReactNode }) {
  return <div className="px-4 py-4 sm:px-6">{children}</div>;
};

Card.Body = function CardBody({ children }: { children: ReactNode }) {
  return <div className="px-4 py-4 sm:px-6">{children}</div>;
};

Card.Footer = function CardFooter({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full items-center space-x-3 justify-between px-4 py-4 sm:px-6">
      {children}
    </div>
  );
};
