import {
  useEffect,
  useState
} from 'react';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

import AppLayout from '../components/AppLayout';

import {
  useAuthStore
} from '../store/authStore';

import {
  fetchServiceReport
} from '../services/salesService';

export default function ServiceReportPage() {

  const user = useAuthStore(
    (state) => state.user
  );

  const [report, setReport] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

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

  useEffect(() => {

    if (user?.business_id) {

      loadReport();

    }

  }, [

    user,

    startDate,

    endDate

  ]);

  const loadReport = async () => {

    if (!user?.business_id) {

      setLoading(false);

      return;

    }

    try {

      const data =
        await fetchServiceReport(

            Number(
                user.business_id
            ),

            startDate,

            endDate

        );

      setReport(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (

      <AppLayout>

        <div className="p-6">
          Loading...
        </div>

      </AppLayout>

    );

  }

  if (!report) {

    return (

      <AppLayout>

        <div className="p-6">

          No service report data found.

        </div>

      </AppLayout>

    );

  }

  return (

  <>

    <style>

      {`
        @media print {

          aside,
          button,
          input {
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

        <div
        className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-4
        "
        >

        <div>

            <h1 className="text-3xl font-semibold">
            Service Report
            </h1>

            <p className="text-sm text-zinc-500 mt-1">
            Service performance and revenue analytics.
            </p>

        </div>

        <button

            onClick={() =>
            window.print()
            }

            className="
            bg-zinc-900
            dark:bg-zinc-100
            text-white
            dark:text-zinc-900
            px-4
            py-2
            rounded-md
            text-sm
            font-medium
            "
        >

            Print Report

        </button>

        </div>

        {/* Filters */}

        <div
        className="
            bg-white
            dark:bg-zinc-900
            border
            border-zinc-200
            dark:border-zinc-800
            rounded-xl
            p-6
        "
        >

        <div
            className="
            flex
            flex-wrap
            gap-2
            mb-4
            "
        >

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
                px-4
                py-2
                rounded-md
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
                px-4
                py-2
                rounded-md
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
                px-4
                py-2
                rounded-md
            "
            >
            Monthly
            </button>

        </div>

        <div
            className="
            grid
            md:grid-cols-2
            gap-4
            "
        >

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
                rounded-md
                p-2
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
                rounded-md
                p-2
            "
            />

        </div>

        </div>

        {/* KPI Cards */}

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-4
        ">

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">

            <p className="text-sm text-zinc-500">
              Total Revenue
            </p>

            <h2 className="text-3xl font-bold mt-2 text-green-600">

              ₱
              {Number(
                report.totalRevenue
                ).toLocaleString(
                undefined,
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
                )}

            </h2>

          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">

            <p className="text-sm text-zinc-500">
              Services Availed
            </p>

            <h2 className="text-3xl font-bold mt-2">

              {report.totalTransactions}

            </h2>

          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">

            <p className="text-sm text-zinc-500">
              Active Services
            </p>

            <h2 className="text-3xl font-bold mt-2">

              {report.totalServices}

            </h2>

          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">

            <p className="text-sm text-zinc-500">
              Avg Revenue / Service
            </p>

            <h2 className="text-3xl font-bold mt-2">

              ₱
              {Number(
                report.averageRevenue
              ).toFixed(2)}

            </h2>

          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">

            <p className="text-sm text-zinc-500">
              Most Availed Service
            </p>

            <h2 className="text-lg font-semibold mt-2">

              {
                report.topService
                  ?.service_name || 'N/A'
              }

            </h2>

          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">

            <p className="text-sm text-zinc-500">
              Highest Revenue Service
            </p>

            <h2 className="text-lg font-semibold mt-2">

              {
                report.topRevenueService
                  ?.service_name || 'N/A'
              }

            </h2>

          </div>

        </div>

        {/* Service Performance Chart */}

        <div className="
          bg-white
          dark:bg-zinc-900
          border
          border-zinc-200
          dark:border-zinc-800
          rounded-xl
          p-6
        ">

          <h2 className="
            text-lg
            font-semibold
            mb-6
          ">

            Most Availed Services

          </h2>

          <div className="h-80">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={report.services}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                dataKey="service_name"
                angle={-20}
                textAnchor="end"
                height={70}
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="total_availed"
                  fill="#3B82F6"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* Service Performance Table */}

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">

          <table className="w-full">

            <thead>

              <tr className="border-b border-zinc-200 dark:border-zinc-800">

                <th className="p-4 text-left">
                  Service
                </th>

                <th className="p-4 text-left">
                  Times Availed
                </th>

                <th className="p-4 text-left">
                  Revenue
                </th>

                <th className="p-4 text-left">
                  Avg Revenue
                </th>

              </tr>

            </thead>

            <tbody>

              {report.services?.map(
                (service: any) => (

                  <tr
                    key={
                      service.service_id
                    }
                    className="border-b border-zinc-100 dark:border-zinc-800"
                  >

                    <td className="p-4">
                      {service.service_name}
                    </td>

                    <td className="p-4">
                      {service.total_availed}
                    </td>

                    <td className="p-4">

                      ₱
                      {Number(
                        service.total_revenue
                      ).toFixed(2)}

                    </td>

                    <td className="p-4">

                      ₱
                      {Number(
                        service.average_revenue
                      ).toFixed(2)}

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

        {/* Service Product Mapping */}

        <div className="
          bg-white
          dark:bg-zinc-900
          border
          border-zinc-200
          dark:border-zinc-800
          rounded-xl
          overflow-hidden
        ">

          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">

            <h2 className="font-semibold">

              Service Product Mapping

            </h2>

          </div>

          <table className="w-full">

            <thead>

              <tr>

                <th className="p-4 text-left">
                  Service
                </th>

                <th className="p-4 text-left">
                  Linked Products
                </th>

              </tr>

            </thead>

            <tbody>

              {report.serviceProducts?.map(
                (item: any) => (

                  <tr
                    key={item.service_id}
                    className="border-t border-zinc-100 dark:border-zinc-800"
                  >

                    <td className="p-4">
                      {item.service_name}
                    </td>

                    <td className="p-4">
                    {item.products ||
                        'No linked products'}
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </AppLayout>

    </>

  );

}