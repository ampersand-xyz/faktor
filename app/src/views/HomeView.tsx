import { useEffect, useState } from 'react';

import { airdrop, getBalance } from '@actions';
import { useAppState } from '@app';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

type State = { loading: boolean; error: Error | null };
const initialState = { loading: false, error: null };

export const HomeView = () => {
  const [, setInvoiceStatus] = useState<string | null>(null);
  const [airdropState, setAirdropState] = useState<State & { amount: number }>({
    amount: 0,
    ...initialState
  });
  const [balanceState, setBalanceState] = useState<State & { balance: number }>({
    ...initialState,
    balance: 0
  });

  const { wallet, endpoint } = useAppState();
  const address = wallet.publicKey.toString();

  useEffect(() => {
    const initBalance = async () => {
      setBalanceState((prev) => ({ ...prev, error: null, loading: true }));

      try {
        const response = await getBalance(endpoint.url, address);
        setBalanceState({ error: null, balance: response, loading: false });
      } catch (err) {
        err instanceof Error &&
          setBalanceState((prev) => ({ ...prev, error: null, loading: false }));
      }
    };

    initBalance();
  }, []);

  async function handleFund() {
    setAirdropState((prev) => ({ ...prev, error: null, loading: true }));
    try {
      await airdrop(endpoint.url, address, airdropState.amount);
      setBalanceState((prev) => ({
        ...prev,
        balance: prev.balance + airdropState.amount
      }));
      setAirdropState({ amount: 0, error: null, loading: false });
    } catch (error) {
      error instanceof Error &&
        setAirdropState((prev) => ({ ...prev, error: null, loading: false }));
    }
  }

  return (
    <div className="App">
      <div className="my-2 px-3 py-5 bg-white shadow-sm border border-gray-200 rounded-lg">
        <div>
          <h3 className="my-2 text-lg font-medium">Wallet:</h3>
          <p>{address}</p>
        </div>
        <h3 className="my-2 text-lg font-medium">Balance:</h3>
        {balanceState.error ? (
          <p className="text-red-500">{`Failed to load balance: ${balanceState.error.message}`}</p>
        ) : (
          <p>
            {balanceState.loading ? 'Loading...' : `${balanceState.balance / LAMPORTS_PER_SOL} SOL`}
          </p>
        )}
        {airdropState.error && <p className="text-red-500">{airdropState.error.message}</p>}
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <label className="font-medium">Amount in amount</label>
            <input
              type="number"
              value={airdropState.amount}
              name="amount"
              placeholder="Enter desired amount of SOL to airdrop"
              onChange={({ currentTarget: { value } }) => {
                const amount = parseInt(value);
                setAirdropState((prev) => ({ ...prev, amount }));
              }}
            />
            <button
              className="my-2 px-4 py-3 font-bold text-white bg-purple-500 rounded-lg"
              onClick={handleFund}
            >
              {airdropState.loading ? 'Funding...' : 'Fund this wallet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
