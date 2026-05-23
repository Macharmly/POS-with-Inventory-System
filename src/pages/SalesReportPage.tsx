import { useState, useEffect } from 'react';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

import AppLayout from '../components/AppLayout';

import {
  fetchSalesReport
} from '../services/salesService';

import {
  fetchExpenses
} from '../services/financeService';

import {
  useAuthStore
} from '../store/authStore';

interface Sale {
  id: number;
  invoice_number: string;
  total_amount: number;
  payment_method: string;
  cashier_name: string;
  created_at: string;
}

interface Expense {
  id: number;
  amount: number;
  category: string;
}

export default function SalesReportPage() {

  const user = useAuthStore(
    (state) => state.user
  );

  const today =
    new Date()
      .toISOString()
      .split('T')[0];

  const [startDate,
    setStartDate] =
    useState(today);

  const [endDate,
    setEndDate] =
    useState(today);

  const [sales,
    setSales] =
    useState<Sale[]>([]);

  const [expenses,
    setExpenses] =
    useState<Expense[]>([]);

  const [totalRevenue,
    setTotalRevenue] =
    useState(0);

  const [totalTransactions,
    setTotalTransactions] =
    useState(0);

  const [loading,
    setLoading] =
    useState(false);

  /* =========================
     Load Report
  ========================= */

  const loadReport =
    async (
      start: string,
      end: string
    ) => {

      try {

        if (!user?.business_id) {
          return;
        }

        setLoading(true);

        const salesData =
          await fetchSalesReport(

            start,
            end,
            user.business_id

          );

        const expensesData =
          await fetchExpenses(

            user.business_id,
            start,
            end

          );

        setSales(
          salesData.sales
        );

        setExpenses(
          expensesData
        );

        setTotalRevenue(
          Number(
            salesData.totalRevenue
          )
        );

        setTotalTransactions(
          Number(
            salesData.totalTransactions
          )
        );

      } catch (error) {

        console.error(
          'Failed to load report',
          error
        );

      } finally {

        setLoading(false);

      }

    };

  /* =========================
     Auto Load
  ========================= */

  useEffect(() => {

    loadReport(
      startDate,
      endDate
    );

  }, [
    startDate,
    endDate,
    user
  ]);

  /* =========================
     Financial Analytics
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

  const netProfit =
    totalRevenue -
    totalExpenses;

  const averageSale =

    totalTransactions > 0

      ? totalRevenue /
        totalTransactions

      : 0;

  /* =========================
     Payment Summary
  ========================= */

  const paymentSummary =

    sales.reduce((acc: any, sale) => {

      const paymentMethod =

        sale.payment_method
          ?.trim()
          .toLowerCase();

      acc[paymentMethod] =

        Number(
          acc[paymentMethod] || 0
        ) +

        Number(
          sale.total_amount
        );

      return acc;

    }, {});

  const paymentData =

    Object.entries(
      paymentSummary
    ).map(

      ([name, value]) => ({

        name:
          name.charAt(0)
            .toUpperCase() +
          name.slice(1),

        value: Number(value)

      })

    );

  /* =========================
     Sales Trend
  ========================= */

  const isDailyView =
    startDate === endDate;

  const salesTrendMap =

    sales.reduce((acc: any, sale) => {

      const saleDate =
        new Date(
          sale.created_at
        );

      const key = isDailyView

        ? saleDate.getHours()

        : saleDate
            .toISOString()
            .split('T')[0];

      acc[key] =

        Number(
          acc[key] || 0
        ) +

        Number(
          sale.total_amount
        );

      return acc;

    }, {});

  const salesTrendData =

    isDailyView

      ? Array.from(

          { length: 24 },

          (_, hour) => ({

            date:
              new Date(
                0,
                0,
                0,
                hour
              ).toLocaleTimeString(
                [],
                {
                  hour: 'numeric',
                  hour12: true
                }
              ),

            total:
              Number(
                salesTrendMap[
                  hour
                ] || 0
              )

          })

        )

      : Object.entries(
          salesTrendMap
        )

          .sort(

            ([a], [b]) =>

              new Date(a)
                .getTime() -

              new Date(b)
                .getTime()

          )

          .map(

            ([date, total]) => ({

              date:
                new Date(date)
                  .toLocaleDateString(),

              total:
                Number(total)

            })

          );

  /* =========================
     Cashier Performance
  ========================= */

  const cashierMap =

    sales.reduce((acc: any, sale) => {

      acc[sale.cashier_name] =

        Number(
          acc[sale.cashier_name] || 0
        ) +

        Number(
          sale.total_amount
        );

      return acc;

    }, {});

  const cashierData =

    Object.entries(
      cashierMap
    ).map(

      ([name, sales]) => ({

        name,

        sales:
          Number(sales)

      })

    );

  /* =========================
     Pie Colors
  ========================= */

  const pieColors = [

    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6'

  ];

  return (
    <>

      <style>
        {`
          @media print {

            aside,
            button,
            input,
            label {
              display: none !important;
            }

            body {
              background: white !important;
            }

          }
        `}
      </style>

      <AppLayout>

        <div className="space-y-6">

          {/* Header */}

          <div className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-4
          ">

            <div>

              <h1 className="
                text-3xl
                font-semibold
                tracking-tight
              ">

                {user?.business_id === 1
                  ? 'Hardware Sales Report'
                  : 'MotorShop Sales Report'}

              </h1>

              <p className="
                text-sm
                text-zinc-500
                dark:text-zinc-400
                mt-1
              ">
                Real-time sales analytics and financial insights.
              </p>

            </div>

            <button
              onClick={() => window.print()}
              className="
                bg-zinc-900
                dark:bg-zinc-100
                text-white
                dark:text-zinc-900
                px-4
                py-2.5
                rounded-md
                text-sm
                font-medium
                transition
                hover:opacity-90
              "
            >
              Print Report
            </button>

          </div>

          {/* Filters */}

          <div className="
            bg-white
            dark:bg-zinc-900
            border
            border-zinc-200
            dark:border-zinc-800
            rounded-lg
            shadow-sm
            p-6
            space-y-6
          ">

            <div className="
              flex
              flex-wrap
              gap-2
            ">

              <button
                onClick={() => {

                  const today =
                    new Date()
                      .toISOString()
                      .split('T')[0];

                  setStartDate(today);
                  setEndDate(today);

                }}
                className="
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  px-4
                  py-2
                  rounded-md
                  text-sm
                  font-medium
                  hover:bg-zinc-100
                  dark:hover:bg-zinc-800
                "
              >
                Daily
              </button>

              <button
                onClick={() => {

                  const today =
                    new Date();

                  const lastWeek =
                    new Date();

                  lastWeek.setDate(
                    today.getDate() - 7
                  );

                  setStartDate(
                    lastWeek
                      .toISOString()
                      .split('T')[0]
                  );

                  setEndDate(
                    today
                      .toISOString()
                      .split('T')[0]
                  );

                }}
                className="
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  px-4
                  py-2
                  rounded-md
                  text-sm
                  font-medium
                  hover:bg-zinc-100
                  dark:hover:bg-zinc-800
                "
              >
                Weekly
              </button>

              <button
                onClick={() => {

                  const today =
                    new Date();

                  const firstDay =
                    new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      1
                    );

                  setStartDate(
                    firstDay
                      .toISOString()
                      .split('T')[0]
                  );

                  setEndDate(
                    today
                      .toISOString()
                      .split('T')[0]
                  );

                }}
                className="
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  px-4
                  py-2
                  rounded-md
                  text-sm
                  font-medium
                  hover:bg-zinc-100
                  dark:hover:bg-zinc-800
                "
              >
                Monthly
              </button>

            </div>

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-4
            ">

              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(
                    e.target.value
                  )
                }
                className="
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  rounded-md
                  px-3
                  py-2.5
                  bg-white
                  dark:bg-zinc-900
                "
              />

              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setEndDate(
                    e.target.value
                  )
                }
                className="
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  rounded-md
                  px-3
                  py-2.5
                  bg-white
                  dark:bg-zinc-900
                "
              />

            </div>

          </div>

          {/* Loading */}

          {loading && (

            <div className="
              bg-white
              dark:bg-zinc-900
              border
              border-zinc-200
              dark:border-zinc-800
              rounded-lg
              p-6
              text-center
              text-sm
              text-zinc-500
              dark:text-zinc-400
            ">
              Loading report...
            </div>

          )}

          {/* KPI Cards */}

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
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

              <p className="text-sm text-zinc-500">
                Total Revenue
              </p>

              <h2 className="
                text-3xl
                font-semibold
                mt-3
                text-green-600
              ">

                ₱
                {totalRevenue.toLocaleString(
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

              <p className="text-sm text-zinc-500">
                Total Expenses
              </p>

              <h2 className="
                text-3xl
                font-semibold
                mt-3
                text-red-600
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

              <p className="text-sm text-zinc-500">
                Net Profit
              </p>

              <h2 className={`
                text-3xl
                font-semibold
                mt-3

                ${
                  netProfit >= 0
                    ? 'text-blue-600'
                    : 'text-red-600'
                }
              `}>

                ₱
                {netProfit.toLocaleString(
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

              <p className="text-sm text-zinc-500">
                Transactions
              </p>

              <h2 className="
                text-3xl
                font-semibold
                mt-3
              ">
                {totalTransactions}
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

              <p className="text-sm text-zinc-500">
                Average Sale
              </p>

              <h2 className="
                text-3xl
                font-semibold
                mt-3
              ">

                ₱
                {averageSale.toLocaleString(
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

              <p className="text-sm text-zinc-500">
                Personal Withdrawals
              </p>

              <h2 className="
                text-3xl
                font-semibold
                mt-3
                text-orange-500
              ">

                ₱
                {personalWithdrawals.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }
                )}

              </h2>

            </div>

          </div>

          {/* Charts */}

          <div className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-6
          ">

            {/* Sales Trend */}

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
                Sales Trend
              </h2>

              <div className="h-80 min-w-0">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  minWidth={300}
                >

                  <LineChart
                    data={salesTrendData}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis dataKey="date" />

                    <YAxis
                      tickFormatter={(value) =>
                        `₱${value}`
                      }
                    />

                    <Tooltip
                      formatter={(value) =>
                        `₱${Number(value).toLocaleString()}`
                      }
                    />

                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#3B82F6"
                      strokeWidth={3}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

            </div>

            {/* Payment Methods */}

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
                Payment Methods
              </h2>

              <div className="h-80 min-w-0">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  minWidth={300}
                >

                  <PieChart>

                    <Pie
                      data={paymentData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${((percent || 0) * 100).toFixed(0)}%`
                      }
                    >

                      {paymentData.map(
                        (_, index) => (

                          <Cell
                            key={index}
                            fill={
                              pieColors[
                                index %
                                pieColors.length
                              ]
                            }
                          />

                        )
                      )}

                    </Pie>

                    <Tooltip
                      formatter={(value) =>
                        `₱${Number(value).toLocaleString()}`
                      }
                    />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            </div>

            {/* Cashier Performance */}

            <div className="
              xl:col-span-2
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
                Cashier Performance
              </h2>

              <div className="h-96 min-w-0">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  minWidth={300}
                >

                  <BarChart
                    data={cashierData}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis dataKey="name" />

                    <YAxis
                      tickFormatter={(value) =>
                        `₱${value}`
                      }
                    />

                    <Tooltip
                      formatter={(value) =>
                        `₱${Number(value).toLocaleString()}`
                      }
                    />

                    <Bar
                      dataKey="sales"
                      fill="#10B981"
                      radius={[8, 8, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </div>

          </div>

        </div>

      </AppLayout>

    </>
  );
}