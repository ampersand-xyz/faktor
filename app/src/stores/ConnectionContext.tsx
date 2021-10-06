import { DEFAULT_CLUSTER, ICluster } from '@core';
import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

interface IConnectionContext {
  cluster: ICluster;
  setCluster: Dispatch<SetStateAction<ICluster>>;
}

const ConnectionContext = createContext<IConnectionContext | undefined>(undefined);

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (!context) throw new Error();
  return context;
};

export const ConnectionProvider: React.FC = ({ children }) => {
  const [cluster, setCluster] = useState(DEFAULT_CLUSTER);

  return (
    <ConnectionContext.Provider
      value={{
        cluster,
        setCluster
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};
