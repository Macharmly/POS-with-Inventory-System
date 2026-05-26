import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Calendar from 'react-calendar';

import 'react-calendar/dist/Calendar.css';

import AppLayout from '../components/AppLayout';

import {
  fetchDashboardAnalytics,
  fetchLowStockProducts
} from '../services/salesService';

import {
  useAuthStore
} from '../store/authStore';

import '../calendar.css';

interface RecentSale {
  invoice_number: string;
  total_amount: number;
  created_at: string;
}

interface LowStockProduct {
  id: number;
  name: string;
  stock_quantity: number;
  selling_price: number;
}

export default function DashboardPage() {

  const navigate = useNavigate();

  const user = useAuthStore(
    (state) => state.user
  );

  const [analytics, setAnalytics] =
    useState({

      totalSales: 0,

      totalRevenue: 0,

      totalProducts: 0,

      lowStockCount: 0,

      recentSales: [] as RecentSale[]

    });

  const [isEditing, setIsEditing] =
    useState(false);

  const [tempNote, setTempNote] =
    useState('');

  const [lowStockProducts,
    setLowStockProducts] =
    useState<LowStockProduct[]>([]);

  const [loading, setLoading] =
    useState(true);

  /* =========================
     Clock & Calendar
  ========================= */

  const [currentTime, setCurrentTime] =
    useState(new Date());

  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const [notes, setNotes] =
    useState<Record<string, string>>(() => {

      const savedNotes =
        localStorage.getItem(
          'dashboard-notes'
        );

      return savedNotes
        ? JSON.parse(savedNotes)
        : {};

    });

  const selectedDateKey =
    selectedDate.toDateString();

  /* =========================
     Load Dashboard
  ========================= */

  useEffect(() => {

    const loadAnalytics = async () => {

      try {

        if (!user?.business_id) {
          return;
        }

        const data =
          await fetchDashboardAnalytics(
            user.business_id
          );

        setAnalytics(data);

        const lowStockData =
          await fetchLowStockProducts(
            user.business_id
          );

        setLowStockProducts(
          lowStockData
        );

      } catch (error) {

        console.error(
          'Failed to load dashboard analytics',
          error
        );

      } finally {

        setLoading(false);

      }

    };

    loadAnalytics();

  }, [user]);

  /* =========================
     Real-Time Clock
  ========================= */

  useEffect(() => {

    const interval = setInterval(() => {

      setCurrentTime(new Date());

    }, 1000);

    return () => clearInterval(interval);

  }, []);

    /* =========================
      Save Notes
    ========================= */

    useEffect(() => {

      localStorage.setItem(
        'dashboard-notes',
        JSON.stringify(notes)
      );

    }, [notes]);

    /* =========================
      Sync Notes Per Date
    ========================= */

    useEffect(() => {

      const currentNote =
        notes[selectedDateKey] || '';

      setTempNote(currentNote);

      setIsEditing(!currentNote);

    }, [selectedDateKey, notes]);

  /* =========================
     Loading State
  ========================= */

  if (loading) {

    return (

      <AppLayout>

        <div className="flex items-center justify-center h-full">

          <p className="text-zinc-500 dark:text-zinc-400">
            Loading dashboard...
          </p>

        </div>

      </AppLayout>

    );

  }

  return (

    <AppLayout>

      <div className="space-y-6">

        {/* Header */}

        <div className="
          flex
          flex-col
          lg:flex-row
          lg:items-start
          lg:justify-between
          gap-4
        ">

          <div>

            <h1 className="text-3xl font-semibold tracking-tight">

              {user?.business_id === 1
                ? 'Hardware Dashboard'
                : 'MotorShop Dashboard'}

            </h1>

            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">

              Overview of your sales, inventory, and business activity.

            </p>

          </div>

          {/* Real-Time Clock */}

          <div className="
            bg-white
            dark:bg-zinc-900
            border
            border-zinc-200
            dark:border-zinc-800
            rounded-xl
            px-5
            py-3
            shadow-sm
            min-w-[340px]
            flex
            items-center
            justify-between
            gap-6
          ">

            <div>

              <p className="
                text-xs
                uppercase
                tracking-wide
                text-zinc-500
                dark:text-zinc-400
              ">
                Philippine Time
              </p>

              <p className="
                text-sm
                text-zinc-500
                dark:text-zinc-400
                mt-1
              ">

                {currentTime.toLocaleDateString(
                  'en-PH',
                  {
                    timeZone: 'Asia/Manila',
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }
                )}

              </p>

            </div>

            <h2 className="
              text-2xl
              font-bold
              tracking-tight
              whitespace-nowrap
            ">

              {currentTime.toLocaleTimeString(
                'en-PH',
                {
                  timeZone: 'Asia/Manila',
                  hour12: true
                }
              )}

            </h2>

          </div>

        </div>

        {/* Analytics Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* Total Sales */}

          <div className="
            bg-white
            dark:bg-zinc-900
            border
            border-zinc-200
            dark:border-zinc-800
            rounded-lg
            p-6
            shadow-sm
          ">

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Total Sales
            </p>

            <h2 className="text-3xl font-semibold mt-3">
              {analytics.totalSales}
            </h2>

          </div>

          {/* Revenue */}

          <div className="
            bg-white
            dark:bg-zinc-900
            border
            border-zinc-200
            dark:border-zinc-800
            rounded-lg
            p-6
            shadow-sm
          ">

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Total Revenue
            </p>

            <h2 className="text-3xl font-semibold mt-3 text-green-600">

              ₱
              {Number(
                analytics.totalRevenue
              ).toFixed(2)}

            </h2>

          </div>

          {/* Products */}

          <div className="
            bg-white
            dark:bg-zinc-900
            border
            border-zinc-200
            dark:border-zinc-800
            rounded-lg
            p-6
            shadow-sm
          ">

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Total Products
            </p>

            <h2 className="text-3xl font-semibold mt-3">
              {analytics.totalProducts}
            </h2>

          </div>

          {/* Low Stock */}

          <div className="
            bg-white
            dark:bg-zinc-900
            border
            border-zinc-200
            dark:border-zinc-800
            rounded-lg
            p-6
            shadow-sm
          ">

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Low Stock Products
            </p>

            <h2 className="text-3xl font-semibold mt-3 text-red-600">
              {analytics.lowStockCount}
            </h2>

          </div>

        </div>

        {/* Quick Access */}

        <div>

          <div className="flex items-center justify-between mb-4">

            <div>

              <h2 className="text-xl font-semibold">
                Quick Access
              </h2>

              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Navigate quickly to system modules.
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

            {[
              {
                title: 'Point of Sale',
                description:
                  'Handle customer checkout transactions.',
                route: '/pos'
              },

              {
                title: 'Inventory',
                description:
                  'Manage products and stock levels.',
                route: '/inventory'
              },

              {
                title: 'Sales History',
                description:
                  'Review completed transactions and invoices.',
                route: '/sales-history'
              },

              {
                title: 'Restock',
                description:
                  'Add inventory stock and replenish products.',
                route: '/restock'
              },

              {
                title: 'Inventory Adjustment',
                description:
                  'Correct stock discrepancies and track damages.',
                route: '/inventory-adjustment'
              },

              {
                title: 'Services',
                description:
                  'Manage MotorShop services and pricing.',
                route: '/services'
              },

              {
                title: 'Reports',
                description:
                  'Access business reports and analytics.',
                route: '/reports'
              }

            ].map((module) => (

              <button
                key={module.route}
                onClick={() =>
                  navigate(module.route)
                }
                className="
                  bg-white
                  dark:bg-zinc-900
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  rounded-lg
                  p-6
                  text-left
                  shadow-sm
                  transition-all
                  duration-200
                  hover:border-zinc-400
                  dark:hover:border-zinc-700
                  hover:-translate-y-0.5
                "
              >

                <h3 className="text-base font-semibold">
                  {module.title}
                </h3>

                <p className="
                  text-sm
                  text-zinc-500
                  dark:text-zinc-400
                  mt-2
                  leading-relaxed
                ">
                  {module.description}
                </p>

              </button>

            ))}

          </div>

        </div>

        {/* Calendar & Notes */}

        <div className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        ">

          {/* Calendar */}

          <div className="
            bg-white
            dark:bg-zinc-900
            border
            border-zinc-200
            dark:border-zinc-800
            rounded-xl
            p-6
            shadow-sm
          ">

            <div className="mb-5">

              <h2 className="
                text-2xl
                font-semibold
                tracking-tight
              ">
                Business Calendar
              </h2>

              <p className="
                text-sm
                text-zinc-500
                dark:text-zinc-400
                mt-1
              ">
                Track business events, reminders,
                expenses, and activities.
              </p>

            </div>

            <div className="
              w-full
              rounded-xl
              border
              border-zinc-200
              dark:border-zinc-700
              p-4
            ">

              <Calendar
                calendarType="gregory"
                onChange={(value) =>
                  setSelectedDate(value as Date)
                }
                value={selectedDate}
                className="w-full border-none"
              />

            </div>

          </div>

          {/* Notes */}

          <div
            className="
              bg-white
              dark:bg-zinc-900
              border
              border-zinc-200
              dark:border-zinc-800
              rounded-xl
              p-6
              shadow-sm
              flex
              flex-col
            "
          >

            <div className="mb-4">

              <h2 className="text-2xl font-semibold tracking-tight">
                Daily Notes
              </h2>

              <p
                className="
                  text-sm
                  text-zinc-500
                  dark:text-zinc-400
                  mt-1
                "
              >

                Notes for{' '}

                <span className="font-medium">

                  {selectedDate.toLocaleDateString(
                    'en-PH',
                    {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }
                  )}

                </span>

              </p>

            </div>

            <textarea
              value={tempNote}
              readOnly={!isEditing}
              onChange={(e) =>
                setTempNote(e.target.value)
              }
              placeholder="
          Add reminders, expenses, supplier visits,
          inventory deliveries, sales events, etc.
              "
              className={`
                w-full
                min-h-[220px]
                rounded-xl
                border
                bg-transparent
                p-4
                resize-none
                outline-none
                text-sm
                leading-relaxed
                transition-all
                duration-200

                ${
                  isEditing
                    ? `
                      border-zinc-300
                      dark:border-zinc-700
                      focus:ring-2
                      focus:ring-zinc-400
                      dark:focus:ring-zinc-600
                    `
                    : `
                      border-zinc-200
                      dark:border-zinc-800
                      text-zinc-500
                      dark:text-zinc-400
                      cursor-default
                    `
                }
              `}
            />

            {/* Action Buttons */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-3
                mt-4
                flex-wrap
              "
            >

              <div className="flex items-center gap-2">

                {!isEditing ? (

                  <button
                    onClick={() =>
                      setIsEditing(true)
                    }
                    className="
                      px-4
                      py-2
                      rounded-lg
                      bg-zinc-900
                      dark:bg-white
                      text-white
                      dark:text-black
                      text-sm
                      font-medium
                      transition
                      hover:opacity-90
                    "
                  >
                    Edit
                  </button>

                ) : (

                  <button
                    onClick={() => {

                      setNotes({
                        ...notes,
                        [selectedDateKey]:
                          tempNote
                      });

                      setIsEditing(false);

                    }}
                    className="
                      px-4
                      py-2
                      rounded-lg
                      bg-green-600
                      text-white
                      text-sm
                      font-medium
                      transition
                      hover:bg-green-700
                    "
                  >
                    Save
                  </button>

                )}

                <button
                  onClick={() => {

                    const updatedNotes = {
                      ...notes
                    };

                    delete updatedNotes[
                      selectedDateKey
                    ];

                    setNotes(updatedNotes);

                    setTempNote('');

                    setIsEditing(true);

                  }}
                  className="
                    px-4
                    py-2
                    rounded-lg
                    border
                    border-red-300
                    text-red-600
                    text-sm
                    font-medium
                    transition
                    hover:bg-red-50
                    dark:hover:bg-red-950/30
                  "
                >
                  Delete
                </button>

              </div>

              <p
                className="
                  text-xs
                  text-zinc-500
                  dark:text-zinc-400
                "
              >

                {tempNote.length} characters

              </p>

            </div>

          </div>

        </div>

        {/* Bottom Grid */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Low Stock Alerts */}

          <div className="
            bg-white
            dark:bg-zinc-900
            border
            border-zinc-200
            dark:border-zinc-800
            rounded-lg
            p-6
            shadow-sm
          ">

            <div className="mb-4">

              <h2 className="text-xl font-semibold">
                Low Stock Alerts
              </h2>

              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Products that require restocking.
              </p>

            </div>

            {lowStockProducts.length === 0 ? (

              <p className="text-zinc-500 dark:text-zinc-400">
                No low stock products.
              </p>

            ) : (

              <div className="overflow-x-auto">

                <table className="min-w-full">

                  <thead className="
                    border-b
                    border-zinc-200
                    dark:border-zinc-800
                  ">

                    <tr>

                      <th className="
                        py-3
                        text-left
                        text-sm
                        font-medium
                        text-zinc-500
                        dark:text-zinc-400
                      ">
                        Product
                      </th>

                      <th className="
                        py-3
                        text-left
                        text-sm
                        font-medium
                        text-zinc-500
                        dark:text-zinc-400
                      ">
                        Stock
                      </th>

                      <th className="
                        py-3
                        text-left
                        text-sm
                        font-medium
                        text-zinc-500
                        dark:text-zinc-400
                      ">
                        Price
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {lowStockProducts.map(
                      (product) => (

                        <tr
                          key={product.id}
                          className="
                            border-b
                            border-zinc-100
                            dark:border-zinc-800
                          "
                        >

                          <td className="py-4 font-medium">
                            {product.name}
                          </td>

                          <td className="py-4 text-red-600 font-semibold">
                            {product.stock_quantity}
                          </td>

                          <td className="py-4">

                            ₱
                            {Number(
                              product.selling_price
                            ).toFixed(2)}

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

          {/* Recent Transactions */}

          <div className="
            bg-white
            dark:bg-zinc-900
            border
            border-zinc-200
            dark:border-zinc-800
            rounded-lg
            p-6
            shadow-sm
          ">

            <div className="mb-4">

              <h2 className="text-xl font-semibold">
                Recent Transactions
              </h2>

              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Latest completed sales activity.
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead className="
                  border-b
                  border-zinc-200
                  dark:border-zinc-800
                ">

                  <tr>

                    <th className="
                      py-3
                      text-left
                      text-sm
                      font-medium
                      text-zinc-500
                      dark:text-zinc-400
                    ">
                      Invoice
                    </th>

                    <th className="
                      py-3
                      text-left
                      text-sm
                      font-medium
                      text-zinc-500
                      dark:text-zinc-400
                    ">
                      Amount
                    </th>

                    <th className="
                      py-3
                      text-left
                      text-sm
                      font-medium
                      text-zinc-500
                      dark:text-zinc-400
                    ">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {analytics.recentSales.map(
                    (sale, index) => (

                      <tr
                        key={index}
                        className="
                          border-b
                          border-zinc-100
                          dark:border-zinc-800
                        "
                      >

                        <td className="py-4">
                          {sale.invoice_number}
                        </td>

                        <td className="py-4 font-medium">

                          ₱
                          {Number(
                            sale.total_amount
                          ).toFixed(2)}

                        </td>

                        <td className="
                          py-4
                          text-zinc-500
                          dark:text-zinc-400
                        ">

                          {new Date(
                            sale.created_at
                          ).toLocaleString()}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </AppLayout>

  );

}