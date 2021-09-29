import { ReactNode } from 'react';
import { NavLink as RRDNavLink } from 'react-router-dom';

export const Header = ({ children }) => {
  return (
    <header className="w-screen h-20 flex items-center gap-4 px-5 bg-gray-900">
      {children}
    </header>
  );
};

export const NavLink = ({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) => {
  return (
    <RRDNavLink
      exact
      to={to}
      activeClassName="text-opacity-100 font-bold"
      className="text-white text-opacity-75 font-medium text-xl"
    >
      {children}
    </RRDNavLink>
  );
};

export const ConnectedHeader = () => {
  return (
    <Header>
      <NavLink to="/">Faktor</NavLink>
      <NavLink to="/new">New</NavLink>
      <NavLink to="/sent">Sent</NavLink>
      <NavLink to="/received">Received</NavLink>
    </Header>
  );
};

export const DefaultHeader = () => {
  return (
    <Header>
      <NavLink to="/">Faktor</NavLink>
    </Header>
  );
};
