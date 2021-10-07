import { useOnClickOutside } from '@ui/hooks';
import React, { useRef, useState } from 'react';
interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ children, open, onClose }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(containerRef, onClose);

  if (!open) return null;

  return (
    <div className="fixed overflow-hidden inset-0 bg-gray-900 bg-opacity-60 w-full h-full flex items-center justify-center px-6 py-4 z-50 box-border transition-opacity">
      <Container onRef={(ref) => (containerRef.current = ref)}>{children}</Container>
    </div>
  );
};

interface ContainerProps {
  onRef: (el: HTMLDivElement | null) => void;
}

export const Container: React.FC<ContainerProps> = ({ children, onRef }) => {
  return (
    <div
      ref={onRef}
      className="relative flex items-center flex-col z-40 max-w-md rounded-lg bg-gray-700 shadow-sm flex-1"
    >
      {children}
    </div>
  );
};

export const SendInvoice = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const closeModal = () => {
    setModalOpen(false);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const modalRef = useRef(null);
  useOnClickOutside(modalRef, closeModal);

  return (
    <>
      <button
        onClick={openModal}
        className="flex items-center justify-center px-4 font-semibold h-11 bg-blue-500 hover:bg-blue-700 rounded-lg"
      >
        Send Invoice
      </button>
      <Modal open={modalOpen} onClose={closeModal}>
        <div className="z-10 relative mx-0 my-auto overflow-x-hidden overflow-y-auto max-h-full px-3 py-5 text-gray-50 w-full list-none">
          <h2>Send Invoice</h2>
        </div>
      </Modal>
    </>
  );
};
