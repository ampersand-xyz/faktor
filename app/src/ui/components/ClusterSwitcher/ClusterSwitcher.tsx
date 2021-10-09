import { ClusterID, CLUSTERS, ICluster } from '@core/connection';
import { useConnection } from '@stores';
import { useCallback, useState } from 'react';
import { CustomSwitcherItem } from './CustomSwitcherItem';
import { SwitcherItem, SwitcherItemData } from './SwitcherItem';
import { RightPanel } from './RightPanel';

export const ClusterSwitcher = () => {
  const { cluster, customCluster, switchCluster } = useConnection();

  const [open, setOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openRightPanel = useCallback(() => {
    setOpen(true);
  }, []);

  const closeRightPanel = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSelect = async (selected: ICluster) => {
    setConnecting(true);
    setError(null);
    try {
      await switchCluster(selected);
      closeRightPanel();
    } catch (err: unknown) {
      err instanceof Error && setError(err.message);
    } finally {
      setConnecting(false);
    }
  };

  const handleSelectCustom = (clusterUrl: string) =>
    handleSelect({
      id: ClusterID.Custom,
      name: ClusterID.Custom,
      url: clusterUrl
    });

  return (
    <div>
      {connecting && <span>Connecting to {cluster.url}...</span>}
      {error && <p>Error: {error}</p>}
      <button
        className="flex justify-start items-center px-3 h-11 mx-auto text-sm rounded-xl bg-white bg-opacity-0 border-2 border-gray-500 font-semibold hover:bg-opacity-5"
        onClick={openRightPanel}
      >
        {cluster.name}
      </button>
      {open && (
        <RightPanel title="Change Network" onHide={closeRightPanel}>
          <Switcher
            current={cluster}
            customCluster={customCluster}
            onRequestSelect={handleSelect}
            onSelectCustom={handleSelectCustom}
          />
        </RightPanel>
      )}
    </div>
  );
};

interface SwitcherProps {
  current: ICluster;
  onRequestSelect: (cluster: ICluster) => Promise<void>;
  customCluster: ICluster | null;
  onSelectCustom: (clusterUrl: string) => Promise<void>;
}

export const Switcher = ({
  current,
  onRequestSelect,
  customCluster,
  onSelectCustom
}: SwitcherProps) => {
  console.log('Cluster selector render', current.url);

  const handleSelect = ({ id: selectedId }: SwitcherItemData) => {
    const selectedCluster = CLUSTERS.find((item) => item.id === selectedId);
    if (!selectedCluster) throw new Error(`No cluster found for ID=${selectedId}`);
    onRequestSelect(selectedCluster);
  };

  return (
    <div className="text-center box-border p-5">
      {CLUSTERS.map((item) => {
        return (
          <SwitcherItem
            isSelected={item.url === current.url}
            key={item.id}
            id={item.id}
            label={item.name}
            onSelect={handleSelect}
          >
            <span>{item.url}</span>
          </SwitcherItem>
        );
      })}
      <CustomSwitcherItem
        cluster={customCluster}
        onSelect={onSelectCustom}
        isSelected={current.url === customCluster?.url}
      />
    </div>
  );
};
