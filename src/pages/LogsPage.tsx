import {
  useEffect,
  useState
} from 'react';

import {
  Navigate
} from 'react-router-dom';

import AppLayout from '../components/AppLayout';

import {
  fetchLogs
} from '../services/logService';

import {
  useAuthStore
} from '../store/authStore';

interface Log {

  id: number;

  user_name: string;

  module: string;

  action: string;

  description: string;

  created_at: string;

}

export default function LogsPage() {

  const user =
    useAuthStore(
      (state) => state.user
    );

  // Admin only

  if (user?.role !== 'admin') {

    return <Navigate to="/" />;

  }

  const [logs, setLogs] =
    useState<Log[]>([]);

  const loadLogs = async () => {

    try {

      const data =
        await fetchLogs();

      setLogs(data);

    } catch (error) {

      console.error(error);

    }

  };

  useEffect(() => {

    loadLogs();

  }, []);

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
            Activity Logs
          </h1>

          <p className="
            text-sm
            text-zinc-500
            dark:text-zinc-400
            mt-1
          ">
            Monitor all activities across the system.
          </p>

        </div>

        {/* Logs Table */}

        <div className="
          bg-white
          dark:bg-zinc-900
          border
          border-zinc-200
          dark:border-zinc-800
          rounded-lg
          shadow-sm
          overflow-hidden
        ">

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="
                border-b
                border-zinc-200
                dark:border-zinc-800
              ">

                <tr>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                  ">
                    User
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                  ">
                    Module
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                  ">
                    Action
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                  ">
                    Description
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                  ">
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {logs.length === 0 ? (

                  <tr>

                    <td
                      colSpan={5}
                      className="
                        px-6
                        py-10
                        text-center
                        text-zinc-500
                      "
                    >
                      No activity logs found.
                    </td>

                  </tr>

                ) : (

                  logs.map((log) => (

                    <tr
                      key={log.id}
                      className="
                        border-b
                        border-zinc-100
                        dark:border-zinc-800
                      "
                    >

                      <td className="px-6 py-4">
                        {log.user_name}
                      </td>

                      <td className="px-6 py-4">
                        {log.module}
                      </td>

                      <td className="px-6 py-4">
                        {log.action}
                      </td>

                      <td className="px-6 py-4">
                        {log.description}
                      </td>

                      <td className="px-6 py-4">
                        {new Date(
                          log.created_at
                        ).toLocaleString()}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </AppLayout>

  );

}