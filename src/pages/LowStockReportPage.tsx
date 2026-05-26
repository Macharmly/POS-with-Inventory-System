import { useEffect, useState } from 'react';

import AppLayout from '../components/AppLayout';

import {
  fetchLowStockProducts
} from '../services/salesService';

import { Product } from '../types/product';

import {
  useAuthStore
} from '../store/authStore';

export default function LowStockReportPage() {

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState('');

  const user = useAuthStore(
    (state) => state.user
  );

  useEffect(() => {

    if (user?.business_id) {

      loadLowStockProducts();

    }

  }, [user]);

  const loadLowStockProducts =
    async () => {

      try {

        const data =
          await fetchLowStockProducts(
            Number(user?.business_id)
          );

        setProducts(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

  const filteredProducts =
    products.filter((product) =>

      product.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )

      ||

      product.category
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

      ||

      product.sku_barcode
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );

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
            Low Stock Report
          </h1>

          <p
            className="
              text-sm
              text-zinc-500
              dark:text-zinc-400
              mt-1
            "
          >
            Monitor products requiring replenishment.
          </p>

        </div>

        {/* Search */}

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
          "
        >

          <input
            type="text"
            placeholder="Search by product, category, or SKU..."
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
                No low stock products found.
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
                      Category
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
                      Stock
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
                      Threshold
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
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredProducts.map(
                    (product) => {

                      const isCritical =
                        product.stock_quantity <= 2;

                      return (

                        <tr
                          key={product.id}
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
                            "
                          >

                            <div>

                              <p className="font-medium">
                                {product.name}
                              </p>

                              <p
                                className="
                                  text-xs
                                  text-zinc-500
                                  dark:text-zinc-400
                                  mt-1
                                "
                              >
                                {product.sku_barcode}
                              </p>

                            </div>

                          </td>

                          <td
                            className="
                              px-6
                              py-4
                              text-sm
                            "
                          >
                            {product.category}
                          </td>

                          <td
                            className="
                              px-6
                              py-4
                            "
                          >

                            <span
                              className={`
                                text-sm
                                font-semibold

                                ${
                                  isCritical

                                    ? 'text-red-600'

                                    : 'text-amber-500'
                                }
                              `}
                            >
                              {product.stock_quantity}
                            </span>

                          </td>

                          <td
                            className="
                              px-6
                              py-4
                              text-sm
                            "
                          >
                            {
                              product.low_stock_threshold
                            }
                          </td>

                          <td
                            className="
                              px-6
                              py-4
                            "
                          >

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
                                  isCritical

                                    ? `
                                      bg-red-100
                                      text-red-700
                                      dark:bg-red-500/10
                                      dark:text-red-400
                                    `

                                    : `
                                      bg-amber-100
                                      text-amber-700
                                      dark:bg-amber-500/10
                                      dark:text-amber-400
                                    `
                                }
                              `}
                            >

                              {isCritical
                                ? 'Critical'
                                : 'Low Stock'}

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