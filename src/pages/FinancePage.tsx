import { useEffect, useState } from 'react';

import AppLayout from '../components/AppLayout';

import {
  fetchExpenses,
  createExpense
} from '../services/financeService';

import {
  useAuthStore
} from '../store/authStore';

interface Expense {
  id: number;
  category: string;
  title: string;
  amount: number;
  notes: string;
  name: string;
  created_at: string;
}

export default function FinancePage() {

  const user = useAuthStore(
    (state) => state.user
  );

  const [expenses,
    setExpenses] =
    useState<Expense[]>([]);

  const [loading,
    setLoading] =
    useState(true);

  const [title,
    setTitle] =
    useState('');

  const [category,
    setCategory] =
    useState('Utilities');

  const [amount,
    setAmount] =
    useState('');

  const [notes,
    setNotes] =
    useState('');

  const [message,
    setMessage] =
    useState('');

  /* =========================
     Load Expenses
  ========================= */

  const loadExpenses =
    async () => {

      try {

        if (!user?.business_id) {
          return;
        }

        const data =
          await fetchExpenses(
            user.business_id
          );

        setExpenses(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    loadExpenses();

  }, [user]);

  /* =========================
     Add Expense
  ========================= */

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        if (!user) return;

        await createExpense({

          business_id:
            user.business_id,

          user_id:
            user.id,

          category,

          title,

          amount:
            Number(amount),

          notes

        });

        setMessage(
          'Expense added successfully.'
        );

        setTitle('');
        setCategory('Utilities');
        setAmount('');
        setNotes('');

        loadExpenses();

      } catch (error) {

        console.error(error);

        setMessage(
          'Failed to add expense.'
        );

      }

    };

  /* =========================
     Finance Summary
  ========================= */

  const totalExpenses =

    expenses.reduce(

      (sum, expense) =>

        sum +
        Number(expense.amount),

      0

    );

  const personalWithdrawals =

    expenses
      .filter(

        (expense) =>

          expense.category ===
          'Personal Withdrawal'

      )

      .reduce(

        (sum, expense) =>

          sum +
          Number(expense.amount),

        0

      );

  return (

    <AppLayout>

      <div className="space-y-6">

        {/* Header */}

        <div>

          <h1 className="
            text-3xl
            font-semibold
            tracking-tight
          ">
            Finance
          </h1>

          <p className="
            text-sm
            text-zinc-500
            dark:text-zinc-400
            mt-1
          ">
            Track business expenses and withdrawals.
          </p>

        </div>

        {/* Summary Cards */}

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-4
        ">

          <div className="
            bg-white
            dark:bg-zinc-900
            border
            border-zinc-200
            dark:border-zinc-800
            rounded-lg
            p-6
          ">

            <p className="
              text-sm
              text-zinc-500
            ">
              Total Expenses
            </p>

            <h2 className="
              text-3xl
              font-semibold
              mt-3
              text-red-500
            ">

              ₱
              {totalExpenses.toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }
              )}

            </h2>

          </div>

          <div className="
            bg-white
            dark:bg-zinc-900
            border
            border-zinc-200
            dark:border-zinc-800
            rounded-lg
            p-6
          ">

            <p className="
              text-sm
              text-zinc-500
            ">
              Personal Withdrawals
            </p>

            <h2 className="
              text-3xl
              font-semibold
              mt-3
              text-orange-500
            ">

              ₱
              {personalWithdrawals
                .toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }
                )}

            </h2>

          </div>

        </div>

        {/* Add Expense */}

        <div className="
          bg-white
          dark:bg-zinc-900
          border
          border-zinc-200
          dark:border-zinc-800
          rounded-lg
          p-6
        ">

          <h2 className="
            text-lg
            font-semibold
            mb-6
          ">
            Add Expense
          </h2>

          {message && (

            <div className="
              mb-4
              bg-emerald-100
              dark:bg-emerald-500/10
              text-emerald-700
              dark:text-emerald-400
              border
              border-emerald-200
              dark:border-emerald-500/20
              rounded-lg
              p-3
              text-sm
            ">
              {message}
            </div>

          )}

          <form
            onSubmit={handleSubmit}
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-4
            "
          >

            <input
              type="text"
              placeholder="Expense title"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              required
              className="
                border
                border-zinc-200
                dark:border-zinc-800
                bg-white
                dark:bg-zinc-900
                rounded-lg
                px-4
                py-3
              "
            />

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className="
                border
                border-zinc-200
                dark:border-zinc-800
                bg-white
                dark:bg-zinc-900
                rounded-lg
                px-4
                py-3
              "
            >

              <option>
                Utilities
              </option>

              <option>
                Salary
              </option>

              <option>
                Fuel
              </option>

              <option>
                Maintenance
              </option>

              <option>
                Supplies
              </option>

              <option>
                Transportation
              </option>

              <option>
                Personal Withdrawal
              </option>

              <option>
                Rent
              </option>

              <option>
                Internet
              </option>

              <option>
                Miscellaneous
              </option>

            </select>

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
              required
              className="
                border
                border-zinc-200
                dark:border-zinc-800
                bg-white
                dark:bg-zinc-900
                rounded-lg
                px-4
                py-3
              "
            />

            <input
              type="text"
              placeholder="Notes"
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              className="
                border
                border-zinc-200
                dark:border-zinc-800
                bg-white
                dark:bg-zinc-900
                rounded-lg
                px-4
                py-3
              "
            />

            <button
              type="submit"
              className="
                md:col-span-2
                bg-zinc-900
                dark:bg-zinc-100
                text-white
                dark:text-zinc-900
                py-3
                rounded-lg
                font-medium
                transition
                hover:opacity-90
              "
            >
              Add Expense
            </button>

          </form>

        </div>

        {/* Expense History */}

        <div className="
          bg-white
          dark:bg-zinc-900
          border
          border-zinc-200
          dark:border-zinc-800
          rounded-lg
          overflow-hidden
        ">

          <div className="
            px-6
            py-4
            border-b
            border-zinc-200
            dark:border-zinc-800
          ">

            <h2 className="
              text-lg
              font-semibold
            ">
              Expense History
            </h2>

          </div>

          {loading ? (

            <div className="
              p-6
              text-center
              text-sm
              text-zinc-500
            ">
              Loading expenses...
            </div>

          ) : expenses.length === 0 ? (

            <div className="
              p-6
              text-center
              text-sm
              text-zinc-500
            ">
              No expenses found.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="
                  bg-zinc-50
                  dark:bg-zinc-800
                ">

                  <tr>

                    <th className="
                      text-left
                      px-6
                      py-3
                      text-sm
                      font-medium
                    ">
                      Date
                    </th>

                    <th className="
                      text-left
                      px-6
                      py-3
                      text-sm
                      font-medium
                    ">
                      Title
                    </th>

                    <th className="
                      text-left
                      px-6
                      py-3
                      text-sm
                      font-medium
                    ">
                      Category
                    </th>

                    <th className="
                      text-left
                      px-6
                      py-3
                      text-sm
                      font-medium
                    ">
                      Amount
                    </th>

                    <th className="
                      text-left
                      px-6
                      py-3
                      text-sm
                      font-medium
                    ">
                      Added By
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {expenses.map((expense) => (

                    <tr
                      key={expense.id}
                      className="
                        border-t
                        border-zinc-200
                        dark:border-zinc-800
                      "
                    >

                      <td className="
                        px-6
                        py-4
                        text-sm
                      ">

                        {new Date(
                          expense.created_at
                        ).toLocaleDateString()}

                      </td>

                      <td className="
                        px-6
                        py-4
                        text-sm
                        font-medium
                      ">
                        {expense.title}
                      </td>

                      <td className="
                        px-6
                        py-4
                        text-sm
                      ">
                        {expense.category}
                      </td>

                      <td className="
                        px-6
                        py-4
                        text-sm
                        text-red-500
                        font-medium
                      ">

                        ₱
                        {Number(
                          expense.amount
                        ).toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }
                        )}

                      </td>

                      <td className="
                        px-6
                        py-4
                        text-sm
                      ">
                        {expense.name}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </AppLayout>

  );
}