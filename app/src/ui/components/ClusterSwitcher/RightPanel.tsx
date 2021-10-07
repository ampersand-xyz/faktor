import { useOnClickOutside } from '@ui/hooks';
import { useRef } from 'react';

interface RightPanelProps {
  title: string;
  onHide: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({ title, onHide, children }) => {
  const containerRef = useRef(null);

  useOnClickOutside(containerRef, onHide);

  return (
    <div className="absolute bg-black bg-opacity-95 top-0 left-0 z-40 w-screen h-screen m-0">
      <div
        ref={containerRef}
        className="absolute bg-gray-700 top-0 right-0 h-screen z-50 text-center box-border p-5"
      >
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
};
