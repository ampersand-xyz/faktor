import { Idl } from '@project-serum/anchor';

interface IdlConfig extends Omit<Required<Idl>, 'events' | 'state'> {
  metadata: { address: string };
}

export const IDL: IdlConfig = {
  version: '0.0.0',
  name: 'faktor',
  instructions: [
    {
      name: 'issueInvoice',
      accounts: [
        {
          name: 'invoice',
          isMut: true,
          isSigner: true
        },
        {
          name: 'issuer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'debtor',
          isMut: false,
          isSigner: false
        },
        {
          name: 'collector',
          isMut: false,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'amount',
          type: 'u64'
        },
        {
          name: 'memo',
          type: 'string'
        }
      ]
    },
    {
      name: 'payInvoice',
      accounts: [
        {
          name: 'invoice',
          isMut: true,
          isSigner: false
        },
        {
          name: 'collector',
          isMut: true,
          isSigner: false
        },
        {
          name: 'debtor',
          isMut: true,
          isSigner: true
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: 'amount',
          type: 'u64'
        }
      ]
    },
    {
      name: 'rejectInvoice',
      accounts: [
        {
          name: 'invoice',
          isMut: true,
          isSigner: false
        },
        {
          name: 'debtor',
          isMut: true,
          isSigner: true
        }
      ],
      args: [
        {
          name: 'isSpam',
          type: 'bool'
        }
      ]
    },
    {
      name: 'voidInvoice',
      accounts: [
        {
          name: 'invoice',
          isMut: true,
          isSigner: false
        },
        {
          name: 'issuer',
          isMut: true,
          isSigner: true
        }
      ],
      args: []
    }
  ],
  accounts: [
    {
      name: 'Invoice',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'issuer',
            type: 'publicKey'
          },
          {
            name: 'debtor',
            type: 'publicKey'
          },
          {
            name: 'collector',
            type: 'publicKey'
          },
          {
            name: 'initialDebt',
            type: 'u64'
          },
          {
            name: 'paidDebt',
            type: 'u64'
          },
          {
            name: 'remainingDebt',
            type: 'u64'
          },
          {
            name: 'memo',
            type: 'string'
          },
          {
            name: 'status',
            type: {
              defined: 'InvoiceStatus'
            }
          }
        ]
      }
    }
  ],
  types: [
    {
      name: 'InvoiceStatus',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Open'
          },
          {
            name: 'Paid'
          },
          {
            name: 'Rejected'
          },
          {
            name: 'Spam'
          },
          {
            name: 'Void'
          }
        ]
      }
    }
  ],
  errors: [
    {
      code: 300,
      name: 'NotEnoughSOL',
      msg: 'Not enough SOL'
    },
    {
      code: 301,
      name: 'InvoiceNotOpen',
      msg: 'This invoice is not open'
    }
  ],
  metadata: {
    address: 'ctoeKp85DThYGxzqcrjPd6w2EG1t43uKJJuxiZFzYWv'
  }
};
