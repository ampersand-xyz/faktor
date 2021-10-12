import { InvoicesStore, InvoiceStatus } from './types';
import * as anchor from '@project-serum/anchor';
import * as web3 from '@solana/web3.js';
import { InvoicesManager } from './InvoicesManager';
import { SolService } from '@core/solana';
import { IDL } from '@core/idl';

const mockOnUpdate = (store: InvoicesStore) => {
  console.log('UPDATED: ', store);
};

const provider = anchor.Provider.local();
anchor.setProvider(provider);
const program = new anchor.Program(IDL, IDL.metadata.address);

const service = new InvoicesManager({ received: [], issued: [] }, provider, mockOnUpdate);

const Addresses = {
  Alice: '6L4fJcx1khkQyVzCAcr2a8Y6LkXHYhMFoXcLrr6244Yn',
  Bob: '3unrZF7yYKd3N42rGSLbhHpzV8tY4u43YUfgH5DvUA5y'
};

const VALID_INVOICE_MATCHER = {
  publicKey: expect.any(web3.PublicKey),
  account: {
    amount: expect.any(Number),
    collector: expect.any(web3.PublicKey),
    debtor: expect.any(web3.PublicKey),
    initialDebt: expect.any(Number),
    memo: expect.any(String),
    paidDebt: expect.any(Number),
    remainingDebt: expect.any(Number),
    status: expect.any(InvoiceStatus)
  }
};

const solService = new SolService(provider.connection);

describe('@core/invoice checks', () => {
  describe('createInvoice()', () => {
    beforeEach(async () => {
      await solService.airdrop(Addresses.Alice, 10);
    });

    it('should create and return an Invoice', async () => {
      const memo = 'create-invoice-test-success';
      const amountInSol = 1;
      const debtor = Addresses.Alice;
      try {
        const issuedInvoice = await service.createInvoice({ debtor, amount: amountInSol, memo });
        expect(issuedInvoice).toMatchObject(VALID_INVOICE_MATCHER);

        const fetchedInvoice = await program.account.invoice.fetch(issuedInvoice.publicKey);
        expect(fetchedInvoice).toMatchObject(VALID_INVOICE_MATCHER);
      } catch (error) {
        expect(error).toBeNull();
      }
    });
  });
});
