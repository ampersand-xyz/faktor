import { ClusterID, connectToCluster, DEFAULT_CLUSTER, ICluster } from '@core/connection';
import { Connection } from '@solana/web3.js';
import { createContext, useContext, useEffect, useState } from 'react';

interface IConnectionContext {
  cluster: ICluster;
  customCluster: ICluster | null;
  switchCluster: (cluster: ICluster) => Promise<void>;
  connection: Connection;
}

const ConnectionContext = createContext<IConnectionContext | undefined>(undefined);

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (!context) throw new Error();
  return context;
};

export const ConnectionProvider: React.FC = ({ children }) => {
  const [connection, setConnection] = useState(new Connection(DEFAULT_CLUSTER.url));
  const [cluster, setCluster] = useState(DEFAULT_CLUSTER);
  const [customCluster, setCustomCluster] = useState<ICluster | null>(null);

  const switchCluster = async (selectedCluster: ICluster): Promise<void> => {
    if (cluster.url === selectedCluster.url) return;
    const connection = await connectToCluster(selectedCluster.url);
    setCluster(selectedCluster);
    setConnection(connection);
    if (selectedCluster.id === ClusterID.Custom) {
      setCustomCluster(selectedCluster);
    }
  };

  useEffect(() => {
    console.log(`\n👌 Connected to cluster ${cluster.url}\n`);
  }, [cluster]);

  return (
    <ConnectionContext.Provider
      value={{
        cluster,
        switchCluster,
        connection,
        customCluster
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};
