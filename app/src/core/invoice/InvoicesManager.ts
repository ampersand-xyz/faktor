import { Wallet } from '@project-serum/anchor';
import { Connection } from '@solana/web3.js';
import { createInvoice } from './createInvoice';
import { loadInvoices } from './loadInvoices';
import { Invoice, InvoiceData, InvoicesStore } from './types';

export class InvoicesManager {
  constructor(
    readonly store: InvoicesStore,
    private connection: Connection,
    private wallet: Wallet,
    readonly onUpdate: (data: InvoicesStore) => void
  ) {}

  private _flushStore() {
    const state: InvoicesStore = {
      ...this.store
    };

    this.onUpdate(state);
  }

  static async load(
    connection: Connection,
    wallet: Wallet,
    onUpdate: (data: InvoicesStore) => void
  ) {
    const invoicesStore = await loadInvoices(connection, wallet);
    const instance = new InvoicesManager(invoicesStore, connection, wallet, onUpdate);
    return instance;
  }

  async createInvoice(data: InvoiceData): Promise<Invoice> {
    console.log('👋 Creating new invoice: ', data);
    const invoice = await createInvoice(this.connection, this.wallet, data);
    console.log(`✅ Successfully issued invoice:`, invoice);

    this.store.issued.push(invoice);
    this._flushStore();

    return invoice;
  }
}
