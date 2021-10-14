import { ReactNode, useRef } from 'react';
import {useOnClickOutside} from 'src/hooks';
interface ModalProps {
  open: boolean;
  onClose: () => void;
  className?: string;
  children: ReactNode;
}

export const Modal = ({ children, open, onClose, className = '' }: ModalProps) => {
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
      className={`relative justify-center flex items-center flex-col z-40 flex-1 ${className}`}
    >
      {children}
    </div>
  );
};
