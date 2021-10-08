import { Form, FormField, FormFieldProps, Modal } from '@ui/common';
import { useState } from 'react';

const inputFields: FormFieldProps[] = [
  {
    id: 'recipient',
    label: 'To',
    placeholder: "Recipient's SOL address"
  },
  { id: 'amount', label: 'Amount', placeholder: 'Amount (SOL)' }
];

export const SendInvoice = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const closeModal = () => {
    setModalOpen(false);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const handleSubmit = (values: Record<typeof inputFields[number]['id'], string>) => {
    console.log(`Sending Invoice:`, values);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="flex items-center justify-center px-4 font-semibold h-11 bg-blue-500 hover:bg-blue-700 rounded-lg"
      >
        Send Invoice
      </button>
      <Modal className="bg-gray-800 bg-opacity-90 max-w-sm" open={modalOpen} onClose={closeModal}>
        <Form
          fields={inputFields}
          onSubmit={handleSubmit}
          className="z-10 relative mx-0 my-auto overflow-x-hidden overflow-y-auto max-h-full px-3 py-5 w-full list-none"
        >
          <h2 className="font-semibold text-2xl">Send Invoice</h2>
          <Form.Fields>
            <>
              {inputFields.map((props) => (
                <li key={props.id}>
                  <FormField
                    {...props}
                    inputClassName="h-12 text-lg w-full text-white placeholder-white placeholder-opacity-40 bg-gray-800 rounded-md border border-gray-500 px-3 py-2"
                  />
                </li>
              ))}
            </>
          </Form.Fields>
          <Form.Actions>
            {({ submitDisabled }) => (
              <div className="flex items-center gap-3 mt-12">
                <button
                  type="submit"
                  className="h-12 flex items-center justify-center w-1/2 bg-gray-700 rounded-lg font-bold text-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitDisabled}
                  className="h-12 flex items-center justify-center w-1/2 bg-indigo-600 rounded-lg font-bold text-lg disabled:bg-gray-700 disabled:bg-opacity-90"
                >
                  Send
                </button>
              </div>
            )}
          </Form.Actions>
        </Form>
      </Modal>
    </>
  );
};
