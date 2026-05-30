import { useEffect, useState } from 'react';

import {
  Eye,
  Search,
  Receipt
} from 'lucide-react';

import AppLayout from '../components/AppLayout';

import ReceiptModal from '../components/ReceiptModal';

import {
  fetchSalesHistory,
  fetchSaleDetails
} from '../services/salesService';

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

export default function SalesHistoryPage() {

  const user = useAuthStore(
    (state) => state.user
  );

  const [sales, setSales] =
    useState<Sale[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState('');

  const [selectedReceipt,
    setSelectedReceipt] =
    useState<any>(null);

  /* =========================
     Load Sales History
  ========================= */

  useEffect(() => {

    const loadSales = async () => {

      try {

        if (!user?.business_id) {
          return;
        }

        const data =
          await fetchSalesHistory(
            user.business_id
          );

        setSales(data);

      } catch (error) {

        console.error(
          'Failed to load sales history',
          error
        );

      } finally {

        setLoading(false);

      }

    };

    loadSales();

  }, [user]);

  /* =========================
     View Receipt
  ========================= */

  const handleViewReceipt = async (
    saleId: number
  ) => {

    try {

      const data =
        await fetchSaleDetails(
          saleId
        );

      setSelectedReceipt({

        saleId:
          data.sale.id,

        invoiceNumber:
          data.sale.invoice_number,

        businessName:
          data.sale.business_name,

        totalAmount:
          data.sale.total_amount,

        discountAmount:
          data.sale.discount_amount || 0,

        paymentMethod:
          data.sale.payment_method,

        cashReceived:
          data.sale.cash_received || 0,

        change:
          data.sale.change_amount || 0,

        createdAt:
          data.sale.created_at,

        items:
          data.items.map(
            (item: any) => ({

              id:
                item.id,

              name:
                item.name,

              quantity:
                item.quantity,

              item_type:
                item.item_type,

              selling_price:
                item.item_type === 'product'
                  ? item.price_at_sale
                  : undefined,

              service_price:
                item.item_type === 'service'
                  ? item.price_at_sale
                  : undefined

            })
          )

      });

    } catch (error) {

      console.error(
        'Failed to load receipt',
        error
      );

    }

  };

  /* =========================
     Search Filter
  ========================= */

  const filteredSales =
    sales.filter((sale) =>

      sale.invoice_number
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )

      ||

      sale.cashier_name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )

      ||

      sale.payment_method
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );

  /* =========================
     Loading
  ========================= */

  if (loading) {

    return (

      <AppLayout>

        <div
          className="
            flex
            items-center
            justify-center
            h-[60vh]
          "
        >

          <p
            className="
              text-zinc-500
              dark:text-zinc-400
            "
          >
            Loading sales history...
          </p>

        </div>

      </AppLayout>

    );

  }

  return (

    <AppLayout>

      <div className="space-y-6">

        {/* Header */}

        <div>

          <h1
            className="
              text-2xl
              sm:text-3xl
              font-semibold
              tracking-tight
            "
          >
            Sales History
          </h1>

          <p
            className="
              text-sm
              text-zinc-500
              dark:text-zinc-400
              mt-1
            "
          >
            Review completed transactions and receipts.
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
            shadow-sm
            p-4
          "
        >

          <div className="relative">

            <Search
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-zinc-400
              "
            />

            <input
              type="text"
              placeholder="
                Search invoice,
                cashier,
                or payment method...
              "
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="
                w-full
                pl-11
                pr-4
                py-3
                bg-white
                dark:bg-zinc-900
                border
                border-zinc-200
                dark:border-zinc-800
                rounded-xl
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-zinc-300
                dark:focus:ring-zinc-700
              "
            />

          </div>

        </div>

        {/* Desktop Table */}

        <div
          className="
            hidden
            lg:block
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

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead
                className="
                  border-b
                  border-zinc-200
                  dark:border-zinc-800
                "
              >

                <tr>

                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-sm
                      font-medium
                      text-zinc-500
                      dark:text-zinc-400
                    "
                  >
                    Invoice
                  </th>

                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-sm
                      font-medium
                      text-zinc-500
                      dark:text-zinc-400
                    "
                  >
                    Cashier
                  </th>

                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-sm
                      font-medium
                      text-zinc-500
                      dark:text-zinc-400
                    "
                  >
                    Payment
                  </th>

                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-sm
                      font-medium
                      text-zinc-500
                      dark:text-zinc-400
                    "
                  >
                    Total
                  </th>

                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-sm
                      font-medium
                      text-zinc-500
                      dark:text-zinc-400
                    "
                  >
                    Date
                  </th>

                  <th
                    className="
                      px-6
                      py-4
                    "
                  />

                </tr>

              </thead>

              <tbody>

                {filteredSales.length === 0 ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="
                        px-6
                        py-16
                        text-center
                        text-zinc-500
                        dark:text-zinc-400
                      "
                    >
                      No sales history found.
                    </td>

                  </tr>

                ) : (

                  filteredSales.map((sale) => (

                    <tr
                      key={sale.id}
                      className="
                        border-b
                        border-zinc-100
                        dark:border-zinc-800
                        hover:bg-zinc-50
                        dark:hover:bg-zinc-800/50
                        transition
                      "
                    >

                      <td
                        className="
                          px-6
                          py-4
                          font-medium
                        "
                      >
                        {sale.invoice_number}
                      </td>

                      <td
                        className="
                          px-6
                          py-4
                        "
                      >
                        {sale.cashier_name}
                      </td>

                      <td
                        className="
                          px-6
                          py-4
                          capitalize
                          text-zinc-500
                          dark:text-zinc-400
                        "
                      >
                        {sale.payment_method}
                      </td>

                      <td
                        className="
                          px-6
                          py-4
                          font-semibold
                        "
                      >

                        ₱
                        {Number(
                          sale.total_amount
                        ).toFixed(2)}

                      </td>

                      <td
                        className="
                          px-6
                          py-4
                          text-zinc-500
                          dark:text-zinc-400
                        "
                      >

                        {new Date(
                          sale.created_at
                        ).toLocaleString()}

                      </td>

                      <td
                        className="
                          px-6
                          py-4
                        "
                      >

                        <button
                          onClick={() =>
                            handleViewReceipt(
                              sale.id
                            )
                          }
                          className="
                            flex
                            items-center
                            gap-2
                            bg-zinc-900
                            dark:bg-zinc-100
                            text-white
                            dark:text-zinc-900
                            px-4
                            py-2
                            rounded-xl
                            text-sm
                            font-medium
                            hover:opacity-90
                            transition
                          "
                        >

                          <Eye size={16} />

                          View Receipt

                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* Mobile + Tablet */}

        <div
          className="
            lg:hidden
            space-y-4
          "
        >

          {filteredSales.length === 0 ? (

            <div
              className="
                bg-white
                dark:bg-zinc-900
                border
                border-zinc-200
                dark:border-zinc-800
                rounded-2xl
                p-8
                text-center
                text-zinc-500
                dark:text-zinc-400
              "
            >
              No sales history found.
            </div>

          ) : (

            filteredSales.map((sale) => (

              <div
                key={sale.id}
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

                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                >

                  <div>

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >

                      <Receipt size={18} />

                      <h3
                        className="
                          font-semibold
                        "
                      >
                        {sale.invoice_number}
                      </h3>

                    </div>

                    <p
                      className="
                        text-sm
                        text-zinc-500
                        dark:text-zinc-400
                        mt-2
                      "
                    >
                      {sale.cashier_name}
                    </p>

                  </div>

                  <span
                    className="
                      font-semibold
                    "
                  >

                    ₱
                    {Number(
                      sale.total_amount
                    ).toFixed(2)}

                  </span>

                </div>

                <div
                  className="
                    mt-4
                    pt-4
                    border-t
                    border-zinc-200
                    dark:border-zinc-800
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >

                  <div>

                    <p
                      className="
                        text-sm
                        capitalize
                        text-zinc-500
                        dark:text-zinc-400
                      "
                    >
                      {sale.payment_method}
                    </p>

                    <p
                      className="
                        text-xs
                        text-zinc-400
                        mt-1
                      "
                    >

                      {new Date(
                        sale.created_at
                      ).toLocaleString()}

                    </p>

                  </div>

                  <button
                    onClick={() =>
                      handleViewReceipt(
                        sale.id
                      )
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      bg-zinc-900
                      dark:bg-zinc-100
                      text-white
                      dark:text-zinc-900
                      px-4
                      py-2.5
                      rounded-xl
                      text-sm
                      font-medium
                    "
                  >

                    <Eye size={16} />

                    Receipt

                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

      {/* Receipt Modal */}

      {selectedReceipt && (

        <ReceiptModal
          receipt={selectedReceipt}
          onClose={() =>
            setSelectedReceipt(null)
          }
        />

      )}

    </AppLayout>

  );

}