import { InvoicesStore, InvoiceStatus } from './types';
import { Program, Provider, Wallet } from '@project-serum/anchor';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { InvoicesManager } from './InvoicesManager';
import { IDL } from '@core/idl';
import { SolService } from '@core/solana';

const mockOnUpdate = (store: InvoicesStore) => {
  console.log('UPDATED: ', store);
};

const connection = new Connection('http://127.0.0.1:8899');
const keypair = Keypair.generate();
const wallet = new Wallet(keypair);
const service = new InvoicesManager({ received: [], issued: [] }, connection, wallet, mockOnUpdate);

const provider = new Provider(connection, wallet, { preflightCommitment: 'confirmed' });
const program = new Program(IDL, IDL.metadata.address, provider);

const Addresses = {
  Alice: '6L4fJcx1khkQyVzCAcr2a8Y6LkXHYhMFoXcLrr6244Yn',
  Bob: '3unrZF7yYKd3N42rGSLbhHpzV8tY4u43YUfgH5DvUA5y'
};

const VALID_INVOICE_MATCHER = {
  publicKey: expect.any(PublicKey),
  account: {
    amount: expect.any(Number),
    collector: expect.any(PublicKey),
    debtor: expect.any(PublicKey),
    initialDebt: expect.any(Number),
    memo: expect.any(String),
    paidDebt: expect.any(Number),
    remainingDebt: expect.any(Number),
    status: expect.any(InvoiceStatus)
  }
};

const solService = new SolService(connection);

describe('@core/invoice checks', () => {
  describe('createInvoice()', () => {
    beforeEach(async () => {
      await solService.airdrop(Addresses.Alice);
      await solService.airdrop(Addresses.Bob);
    });

    it('should create and return an Invoice', async () => {
      const memo = 'create-invoice-test-success';
      const amount = 2 * LAMPORTS_PER_SOL;
      const debtor = Addresses.Alice;
      try {
        const issuedInvoice = await service.createInvoice({ debtor, amount, memo });
        expect(issuedInvoice).toMatchObject(VALID_INVOICE_MATCHER);

        const fetchedInvoice = await program.account.invoice.fetch(issuedInvoice.publicKey);
        expect(fetchedInvoice).toMatchObject(VALID_INVOICE_MATCHER);
      } catch (error) {
        expect(error).toBeNull();
      }
    });
  });
});
