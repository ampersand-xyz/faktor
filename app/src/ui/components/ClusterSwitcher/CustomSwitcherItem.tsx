import { ClusterID, connectToCluster, ICluster } from '@core';
import { useState, useCallback, useMemo } from 'react';
import { SwitcherItem } from './SwitcherItem';

interface CustomSwitcherItemProps {
  onSelect: (clusterUrl: string) => void;
  isSelected: boolean;
  cluster: ICluster | null;
}

export const CustomSwitcherItem = ({ cluster, onSelect, isSelected }: CustomSwitcherItemProps) => {
  const [verifying, setVerifying] = useState<boolean>(false);
  const [inputValue, onChange] = useState<string | undefined>(cluster?.url);
  const [error, setError] = useState<string | null>(null);

  const runClusterVerification = async (clusterUrl: string): Promise<boolean> => {
    let result = false;
    await verifyCluster(
      clusterUrl,
      () => {
        result = true;
      },
      () => {
        console.log(`Invalid cluster url ${clusterUrl}`);
        throw new Error(`Invalid cluster url ${clusterUrl}`);
      }
    );
    return result;
  };

  const handleSelectCustomCluster = useCallback(() => {
    if (!inputValue) {
      setError('Invalid cluster URL');
      return;
    }
    setVerifying(true);
    setError(null);
    runClusterVerification(inputValue)
      .then((isValid) => {
        isValid && onSelect(inputValue);
        setVerifying(false);
      })
      .catch((error: Error) => {
        setError(error.message);
        setVerifying(false);
      });
  }, [inputValue]);

  const handleChange = useCallback(
    ({ currentTarget: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      onChange(value);
    },
    []
  );

  const value = useMemo(() => inputValue ?? 'Enter custom url', [inputValue]);

  return (
    <SwitcherItem
      id={ClusterID.Custom}
      label="Custom"
      isSelected={isSelected}
      onSelect={handleSelectCustomCluster}
    >
      {error && <p>Error: {error}</p>}
      {verifying && <p>Verifying...</p>}
      <input value={value} type="text" onChange={handleChange} />
    </SwitcherItem>
  );
};

const clusterTestQueue: string[] = [];
async function verifyCluster(
  clusterUrl: string,
  onValid: () => void,
  onInvalid: () => void
): Promise<void> {
  try {
    clusterTestQueue.push(clusterUrl);
    await connectToCluster(clusterUrl);
    clusterTestQueue.splice(0, 1);
    onValid();
  } catch (err) {
    clusterTestQueue.splice(0, 1);
    onInvalid();
  }
}
