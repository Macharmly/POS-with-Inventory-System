import { useEffect, useState } from 'react';

import AppLayout from '../components/AppLayout';

import {
  fetchProfitReport
} from '../services/salesService';

import {
  useAuthStore
} from '../store/authStore';

interface ProfitItem {
  product_id: number;
  product_name: string;
  quantity_sold: number;
  revenue: number;
  cost: number;
  profit: number;
}

export default function ProfitReportPage() {

  const user = useAuthStore(
    (state) => state.user
  );

  const [loading, setLoading] =
    useState(true);

  const [profitData, setProfitData] =
    useState<ProfitItem[]>([]);

  useEffect(() => {

    if (user?.business_id) {

      loadProfitReport();

    }

  }, [user]);

  const loadProfitReport =
    async () => {

      try {

        const data =
          await fetchProfitReport(
            Number(user?.business_id)
          );

        setProfitData(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

  const totalRevenue =
    profitData.reduce(
      (sum, item) =>
        sum + Number(item.revenue),
      0
    );

  const totalCost =
    profitData.reduce(
      (sum, item) =>
        sum + Number(item.cost),
      0
    );

  const totalProfit =
    profitData.reduce(
      (sum, item) =>
        sum + Number(item.profit),
      0
    );

  const profitMargin =
    totalRevenue > 0

      ? (
          (totalProfit / totalRevenue) * 100
        ).toFixed(2)

      : '0';

  return (

    <AppLayout>

      <div className="space-y-6">

        {/* Header */}

        <div>

          <h1
            className="
              text-3xl
              font-semibold
              tracking-tight
            "
          >
            Profit Report
          </h1>

          <p
            className="
              text-sm
              text-zinc-500
              dark:text-zinc-400
              mt-1
            "
          >
            Analyze business profitability and earnings.
          </p>

        </div>

        {/* Summary Cards */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-4
          "
        >

          {/* Revenue */}

          <div
            className="
              bg-white
              dark:bg-zinc-900
              border
              border-zinc-200
              dark:border-zinc-800
              rounded-2xl
              p-5
              shadow-sm
            "
          >

            <p
              className="
                text-sm
                text-zinc-500
                dark:text-zinc-400
              "
            >
              Total Revenue
            </p>

            <h2
              className="
                text-2xl
                font-semibold
                mt-2
              "
            >
              ₱
              {totalRevenue.toFixed(2)}
            </h2>

          </div>

          {/* Cost */}

          <div
            className="
              bg-white
              dark:bg-zinc-900
              border
              border-zinc-200
              dark:border-zinc-800
              rounded-2xl
              p-5
              shadow-sm
            "
          >

            <p
              className="
                text-sm
                text-zinc-500
                dark:text-zinc-400
              "
            >
              Total Cost
            </p>

            <h2
              className="
                text-2xl
                font-semibold
                mt-2
              "
            >
              ₱
              {totalCost.toFixed(2)}
            </h2>

          </div>

          {/* Profit */}

          <div
            className="
              bg-white
              dark:bg-zinc-900
              border
              border-zinc-200
              dark:border-zinc-800
              rounded-2xl
              p-5
              shadow-sm
            "
          >

            <p
              className="
                text-sm
                text-zinc-500
                dark:text-zinc-400
              "
            >
              Gross Profit
            </p>

            <h2
              className="
                text-2xl
                font-semibold
                mt-2
                text-emerald-500
              "
            >
              ₱
              {totalProfit.toFixed(2)}
            </h2>

          </div>

          {/* Margin */}

          <div
            className="
              bg-white
              dark:bg-zinc-900
              border
              border-zinc-200
              dark:border-zinc-800
              rounded-2xl
              p-5
              shadow-sm
            "
          >

            <p
              className="
                text-sm
                text-zinc-500
                dark:text-zinc-400
              "
            >
              Profit Margin
            </p>

            <h2
              className="
                text-2xl
                font-semibold
                mt-2
              "
            >
              {profitMargin}%
            </h2>

          </div>

        </div>

        {/* Profit Table */}

        <div
          className="
            bg-white
            dark:bg-zinc-900
            border
            border-zinc-200
            dark:border-zinc-800
            rounded-2xl
            shadow-sm
            overflow-hidden
          "
        >

          {loading ? (

            <div className="p-6">

              <p
                className="
                  text-sm
                  text-zinc-500
                  dark:text-zinc-400
                "
              >
                Loading report...
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead
                  className="
                    bg-zinc-50
                    dark:bg-zinc-800/50
                  "
                >

                  <tr>

                    <th
                      className="
                        text-left
                        px-6
                        py-4
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-zinc-500
                        dark:text-zinc-400
                      "
                    >
                      Product
                    </th>

                    <th
                      className="
                        text-left
                        px-6
                        py-4
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-zinc-500
                        dark:text-zinc-400
                      "
                    >
                      Qty Sold
                    </th>

                    <th
                      className="
                        text-left
                        px-6
                        py-4
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-zinc-500
                        dark:text-zinc-400
                      "
                    >
                      Revenue
                    </th>

                    <th
                      className="
                        text-left
                        px-6
                        py-4
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-zinc-500
                        dark:text-zinc-400
                      "
                    >
                      Cost
                    </th>

                    <th
                      className="
                        text-left
                        px-6
                        py-4
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-zinc-500
                        dark:text-zinc-400
                      "
                    >
                      Profit
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {profitData.map((item, index) => (

                  <tr key={`${item.product_id}-${index}`}
                      className="
                        border-t
                        border-zinc-200
                        dark:border-zinc-800
                      "
                    >

                      <td
                        className="
                          px-6
                          py-4
                          font-medium
                        "
                      >
                        {item.product_name}
                      </td>

                      <td
                        className="
                          px-6
                          py-4
                          text-sm
                        "
                      >
                        {item.quantity_sold}
                      </td>

                      <td
                        className="
                          px-6
                          py-4
                          text-sm
                        "
                      >
                        ₱
                        {Number(
                          item.revenue
                        ).toFixed(2)}
                      </td>

                      <td
                        className="
                          px-6
                          py-4
                          text-sm
                        "
                      >
                        ₱
                        {Number(
                          item.cost
                        ).toFixed(2)}
                      </td>

                      <td
                        className="
                          px-6
                          py-4
                          text-sm
                          font-semibold
                          text-emerald-500
                        "
                      >
                        ₱
                        {Number(
                          item.profit
                        ).toFixed(2)}
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