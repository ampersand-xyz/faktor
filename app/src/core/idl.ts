import { Idl } from '@project-serum/anchor';

interface IdlConfig extends Omit<Required<Idl>, 'events' | 'state' | 'types'> {
  metadata: { address: string };
}

export const IDL: IdlConfig = {
  version: '0.0.0',
  name: 'solstream',
  instructions: [
    {
      name: 'createStream',
      accounts: [
        {
          name: 'stream',
          isMut: true,
          isSigner: false
        },
        {
          name: 'sender',
          isMut: true,
          isSigner: true
        },
        {
          name: 'receiver',
          isMut: true,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'clock',
          isMut: false,
          isSigner: false
        },
        {
          name: 'rent',
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
          name: 'interval',
          type: 'u64'
        },
        {
          name: 'balance',
          type: 'u64'
        },
        {
          name: 'bump',
          type: 'u8'
        }
      ]
    },
    {
      name: 'fundStream',
      accounts: [
        {
          name: 'stream',
          isMut: true,
          isSigner: false
        },
        {
          name: 'sender',
          isMut: true,
          isSigner: true
        },
        {
          name: 'receiver',
          isMut: true,
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
        }
      ]
    },
    {
      name: 'processStream',
      accounts: [
        {
          name: 'stream',
          isMut: true,
          isSigner: false
        },
        {
          name: 'signer',
          isMut: true,
          isSigner: true
        },
        {
          name: 'sender',
          isMut: true,
          isSigner: false
        },
        {
          name: 'receiver',
          isMut: true,
          isSigner: false
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false
        },
        {
          name: 'clock',
          isMut: false,
          isSigner: false
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false
        }
      ],
      args: []
    }
  ],
  accounts: [
    {
      name: 'Stream',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'sender',
            type: 'publicKey'
          },
          {
            name: 'receiver',
            type: 'publicKey'
          },
          {
            name: 'amount',
            type: 'u64'
          },
          {
            name: 'interval',
            type: 'u64'
          },
          {
            name: 'timestamp',
            type: 'i64'
          },
          {
            name: 'bump',
            type: 'u8'
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
    }
  ],
  metadata: {
    address: 'ERcZbB9tJd1ghMYydFBEzn5ERGf48jxEBoozxco6D5WF'
  }
};
