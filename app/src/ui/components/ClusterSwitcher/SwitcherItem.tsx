import React, { useCallback } from 'react';

export interface SwitcherItemData {
  id: string;
  label: string;
}

interface SwitcherItemProps {
  isSelected: boolean;
  id: string;
  label: string;
  onSelect: (args: SwitcherItemData) => void;
}

export const SwitcherItem: React.FC<SwitcherItemProps> = ({
  isSelected,
  id,
  label,
  onSelect,
  children
}) => {
  const handleSelect = useCallback(() => {
    onSelect({ id, label });
  }, [id, label]);

  return (
    <button
      id={id}
      className={`${
        isSelected ? 'border-2 border-orange-5' : ''
      } flex items-start flex-col p-2.5 border-1 border-gray-500 rounded-lg mb-2.5 cursor-pointer`}
      onClick={handleSelect}
    >
      <span>{label}:&nbsp;</span>
      {children}
    </button>
  );
};
