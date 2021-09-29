import { ReactNode } from 'react';

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <body>
      <main className="h-screen w-screen">
        <header className="w-screen h-24 py-5 px-8 flex items-center gap-4">
          <a href="/#">HOME</a>
          <a href="/#/new">NEW</a>
          <a href="/#/sent">SENT</a>
          <a href="/#/received">RECEIVED</a>
        </header>
        {children}
      </main>
    </body>
  );
};
