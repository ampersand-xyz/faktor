import { SendInvoice } from './SendInvoice';

export const InvoicesHeader = () => {
  return (
    <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 mt-8">
      <h2 className="text-center text-lg font-medium leading-6 text-gray-900">Recent activity</h2>
      <aside>
        <SendInvoice />
      </aside>
    </div>
  );
};
