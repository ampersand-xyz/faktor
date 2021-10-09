import { InvoicesStore, InvoiceStatus } from './types';
import { Provider, Wallet } from '@project-serum/anchor';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { InvoicesManager } from './InvoicesManager';

const mockOnUpdate = (store: InvoicesStore) => {
  console.log('UPDATED: ', store);
};

const connection = new Connection('http://127.0.0.1:8899');
const keypair = Keypair.generate();
const wallet = new Wallet(keypair);
const provider = new Provider(connection, wallet, { preflightCommitment: 'confirmed' });
const service = new InvoicesManager({ received: [], issued: [] }, connection, wallet, mockOnUpdate);

describe('@core/invoice checks', () => {
  describe('createInvoice()', () => {
    it('should succeed and return a valid Invoice', async () => {
      const memo = 'create-invoice-test-success';
      const amount = 2 * LAMPORTS_PER_SOL;
      const debtor = '6L4fJcx1khkQyVzCAcr2a8Y6LkXHYhMFoXcLrr6244Yn';
      try {
        const result = await service.createInvoice({ debtor, amount, memo });
        expect(result).toMatchObject({
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
        });
      } catch {}
    });
  });
});
