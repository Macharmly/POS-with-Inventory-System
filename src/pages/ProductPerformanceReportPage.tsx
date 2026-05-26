import { useEffect, useState } from 'react';

import axios from 'axios';

import AppLayout from '../components/AppLayout';

import {
  useAuthStore
} from '../store/authStore';

interface ProductPerformance {

  product_id: number;

  product_name: string;

  total_quantity_sold: number;

  total_revenue: number;

}

export default function ProductPerformanceReportPage() {

  const [products, setProducts] =
    useState<ProductPerformance[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState('');

  const [selectedRange, setSelectedRange] =
    useState('all');

  const user = useAuthStore(
    (state) => state.user
  );

  useEffect(() => {

    if (user?.business_id) {

      loadReport('all');

    }

  }, [user]);

  const loadReport =
    async (
      range = selectedRange
    ) => {

      try {

        setLoading(true);

        let start = '';
        let end = '';

        const today =
          new Date();

        const formatDate =
          (date: Date) => {

            return date
              .toISOString()
              .split('T')[0];

          };

        if (range === 'daily') {

          start =
            formatDate(today);

          end =
            formatDate(today);

        }

        if (range === 'weekly') {

          const firstDay =
            new Date();

          firstDay.setDate(
            today.getDate() - 7
          );

          start =
            formatDate(firstDay);

          end =
            formatDate(today);

        }

        if (range === 'monthly') {

          const firstDay =
            new Date(
              today.getFullYear(),
              today.getMonth(),
              1
            );

          start =
            formatDate(firstDay);

          end =
            formatDate(today);

        }

        if (range === 'yearly') {

          const firstDay =
            new Date(
              today.getFullYear(),
              0,
              1
            );

          start =
            formatDate(firstDay);

          end =
            formatDate(today);

        }

        const response =
          await axios.get(

            'http://localhost:5000/api/reports/product-performance',

            {
              params: {

                business_id:
                  user?.business_id,

                startDate: start,

                endDate: end

              }

            }

          );

        setProducts(response.data);

        setSelectedRange(range);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

  const filteredProducts =
    products.filter((product) =>

      product.product_name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );

  const totalRevenue =
    products.reduce(

      (sum, product) =>

        sum +
        Number(
          product.total_revenue
        ),

      0

    );

  const totalQuantitySold =
    products.reduce(

      (sum, product) =>

        sum +
        Number(
          product.total_quantity_sold
        ),

      0

    );

  const bestSellingProduct =
    [...products].sort(

      (a, b) =>

        b.total_quantity_sold -
        a.total_quantity_sold

    )[0];

  const slowMovingProduct =
    [...products].sort(

      (a, b) =>

        a.total_quantity_sold -
        b.total_quantity_sold

    )[0];

  const topProducts =
    [...products]
      .sort(

        (a, b) =>

          b.total_quantity_sold -
          a.total_quantity_sold

      )
      .slice(0, 10);

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
            Product Performance Report
          </h1>

          <p
            className="
              text-sm
              text-zinc-500
              dark:text-zinc-400
              mt-1
            "
          >
            Analyze best-selling,
            slow-moving,
            and high-revenue products.
          </p>

        </div>

        {/* Filters */}

        <div
          className="
            bg-white
            dark:bg-zinc-900
            border
            border-zinc-200
            dark:border-zinc-800
            rounded-2xl
            p-4
            shadow-sm
            space-y-4
          "
        >

          <div
            className="
              flex
              flex-wrap
              gap-3
            "
          >

            {[
              {
                label: 'Daily',
                value: 'daily'
              },

              {
                label: 'Weekly',
                value: 'weekly'
              },

              {
                label: 'Monthly',
                value: 'monthly'
              },

              {
                label: 'Yearly',
                value: 'yearly'
              },

              {
                label: 'All-Time',
                value: 'all'
              }

            ].map((button) => (

              <button
                key={button.value}
                onClick={() =>
                  loadReport(
                    button.value
                  )
                }
                className={`
                  px-4
                  py-2
                  rounded-xl
                  text-sm
                  font-medium
                  transition

                  ${
                    selectedRange ===
                    button.value

                      ? `
                        bg-black
                        dark:bg-white
                        text-white
                        dark:text-black
                      `

                      : `
                        bg-zinc-100
                        dark:bg-zinc-800
                        text-zinc-700
                        dark:text-zinc-300
                      `
                  }
                `}
              >

                {button.label}

              </button>

            ))}

          </div>

        </div>

        {/* Summary Cards */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-4
            gap-4
          "
        >

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
              Total Quantity Sold
            </p>

            <h2
              className="
                text-3xl
                font-bold
                mt-2
              "
            >
              {totalQuantitySold}
            </h2>

          </div>

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
                text-3xl
                font-bold
                mt-2
              "
            >
              ₱
              {totalRevenue.toLocaleString()}
            </h2>

          </div>

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
              Best-Selling Product
            </p>

            <h2
              className="
                text-xl
                font-bold
                mt-2
              "
            >
              {
                bestSellingProduct
                  ?.product_name
              }
            </h2>

          </div>

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
              Slow-Moving Product
            </p>

            <h2
              className="
                text-xl
                font-bold
                mt-2
              "
            >
              {
                slowMovingProduct
                  ?.product_name
              }
            </h2>

          </div>

        </div>

        {/* Top 10 Products */}

        <div
          className="
            bg-white
            dark:bg-zinc-900
            border
            border-zinc-200
            dark:border-zinc-800
            rounded-2xl
            p-6
            shadow-sm
          "
        >

          <h2
            className="
              text-lg
              font-semibold
              mb-4
            "
          >
            Top 10 Best-Selling Products
          </h2>

          <div className="space-y-3">

            {topProducts.map(
              (
                product,
                index
              ) => (

                <div
                  key={
                    product.product_id
                  }
                  className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-zinc-200
                    dark:border-zinc-800
                    pb-3
                  "
                >

                  <div>

                    <p className="font-medium">
                      #{index + 1}{' '}
                      {
                        product.product_name
                      }
                    </p>

                    <p
                      className="
                        text-sm
                        text-zinc-500
                        dark:text-zinc-400
                      "
                    >
                      Qty Sold:{' '}
                      {
                        product.total_quantity_sold
                      }
                    </p>

                  </div>

                  <p className="font-semibold">

                    ₱
                    {Number(
                      product.total_revenue
                    ).toLocaleString()}

                  </p>

                </div>

              )
            )}

          </div>

        </div>

        {/* Report Table */}

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

            <div
            className="
                p-4
                border-b
                border-zinc-200
                dark:border-zinc-800
            "
            >

            <input
                type="text"
                placeholder="Search product..."
                value={search}
                onChange={(e) =>
                setSearch(
                    e.target.value
                )
                }
                className="
                w-full
                bg-white
                dark:bg-zinc-900
                border
                border-zinc-200
                dark:border-zinc-800
                rounded-xl
                px-4
                py-3
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-zinc-300
                dark:focus:ring-zinc-700
                "
            />

            </div>

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

          ) : filteredProducts.length === 0 ? (

            <div className="p-6">

              <p
                className="
                  text-sm
                  text-zinc-500
                  dark:text-zinc-400
                "
              >
                No product data found.
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

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Product
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Quantity Sold
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Revenue
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Performance
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredProducts.map(
                    (product) => {

                      const isFastMoving =
                        product.total_quantity_sold >= 50;

                      return (

                        <tr
                          key={
                            product.product_id
                          }
                          className="
                            border-t
                            border-zinc-200
                            dark:border-zinc-800
                          "
                        >

                          <td className="px-6 py-4 font-medium">
                            {
                              product.product_name
                            }
                          </td>

                          <td className="px-6 py-4">
                            {
                              product.total_quantity_sold
                            }
                          </td>

                          <td className="px-6 py-4">

                            ₱
                            {Number(
                              product.total_revenue
                            ).toLocaleString()}

                          </td>

                          <td className="px-6 py-4">

                            <span
                              className={`
                                inline-flex
                                items-center
                                rounded-full
                                px-2.5
                                py-1
                                text-xs
                                font-medium

                                ${
                                  isFastMoving

                                    ? `
                                      bg-green-100
                                      text-green-700
                                      dark:bg-green-500/10
                                      dark:text-green-400
                                    `

                                    : `
                                      bg-red-100
                                      text-red-700
                                      dark:bg-red-500/10
                                      dark:text-red-400
                                    `
                                }
                              `}
                            >

                              {isFastMoving
                                ? 'Fast Moving'
                                : 'Slow Moving'}

                            </span>

                          </td>

                        </tr>

                      );

                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </AppLayout>

  );

}