import { useOnClickOutside } from '@ui/hooks';
import { useRef } from 'react';
interface ModalProps {
  open: boolean;
  onClose: () => void;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  open,
  onClose,
  className = 'max-w-md'
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(containerRef, onClose);

  if (!open) return null;

  return (
    <div className="fixed overflow-hidden inset-0 bg-gray-900 bg-opacity-60 w-full h-full flex items-center justify-center px-6 py-4 z-50 box-border transition-opacity">
      <Container className={className} onRef={(ref) => (containerRef.current = ref)}>
        {children}
      </Container>
    </div>
  );
};

interface ContainerProps {
  onRef: (el: HTMLDivElement | null) => void;
  className: string;
}

export const Container: React.FC<ContainerProps> = ({ children, onRef, className }) => {
  return (
    <div
      ref={onRef}
      className={`relative flex items-center flex-col z-40 rounded-lg shadow-sm flex-1 ${className}`}
    >
      {children}
    </div>
  );
};
