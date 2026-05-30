import {
  useEffect,
  useState
} from 'react';

import AppLayout from '../components/AppLayout';

import {
  useAuthStore
} from '../store/authStore';

import {
  fetchServiceReport
}
from '../services/salesService';

export default function ServiceReportPage() {

  const user = useAuthStore(
    (state) => state.user
  );

  const [report, setReport] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    if (user?.business_id) {

        loadReport();

    }

  }, [user]);

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
            )
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

    <AppLayout>

      <div className="space-y-6">

        <div>

          <h1 className="text-3xl font-semibold">

            Service Report

          </h1>

          <p className="text-sm text-zinc-500 mt-1">

            Service performance and revenue analytics.

          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">

            <p className="text-sm text-zinc-500">

              Total Service Revenue

            </p>

            <h2 className="text-3xl font-bold mt-2">

              ₱
              {Number(
                report.totalRevenue
              ).toFixed(2)}

            </h2>

          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">

            <p className="text-sm text-zinc-500">

              Total Services Availed

            </p>

            <h2 className="text-3xl font-bold mt-2">

              {
                report.totalTransactions
              }

            </h2>

          </div>

        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">

          <table className="w-full">

            <thead>

              <tr className="border-b border-zinc-200 dark:border-zinc-800">

                <th className="p-4 text-left">

                  Service

                </th>

                <th className="p-4 text-left">

                  Availed

                </th>

                <th className="p-4 text-left">

                  Revenue

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

                    </tr>

                    )
                )}

                </tbody>

          </table>

        </div>

      </div>

    </AppLayout>

  );

}