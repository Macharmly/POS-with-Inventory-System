import { useNavigate } from 'react-router-dom';

import AppLayout from '../components/AppLayout';

export default function ReportsPage() {

  const navigate = useNavigate();

  const reports = [

    {
      title: 'Sales Report',
      description:
        'Generate daily, weekly, monthly, and custom sales reports.',
      route: '/reports/sales'
    },

    {
      title: 'Inventory Report',
      description:
        'Monitor inventory levels, stock status, and inventory value.',
      route: '/inventory-reports'
    },

    {
      title: 'Low Stock Report',
      description:
        'Identify products requiring immediate replenishment.',
      route: '/reports/low-stock'
    },

    {
      title: 'Profit Report',
      description:
        'Analyze profitability, margins, and business earnings.',
      route: '/reports/profit'
    },

    {
      title: 'Service Report',
      description:
        'Review MotorShop service transactions and labor revenue.',
      route: '/reports/services'
    }

  ];

  return (

    <AppLayout>

      <div className="space-y-6">

        {/* Page Header */}

        <div>

          <h1 className="
            text-3xl
            font-semibold
            tracking-tight
          ">
            Reports Center
          </h1>

          <p className="
            text-sm
            text-zinc-500
            dark:text-zinc-400
            mt-1
          ">
            Business analytics and printable reports.
          </p>

        </div>

        {/* Reports Grid */}

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-4
        ">

          {reports.map((report) => (

            <button
              key={report.route}
              onClick={() =>
                navigate(report.route)
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

              <h2 className="
                text-lg
                font-semibold
              ">
                {report.title}
              </h2>

              <p className="
                text-sm
                text-zinc-500
                dark:text-zinc-400
                mt-2
                leading-relaxed
              ">
                {report.description}
              </p>

            </button>

          ))}

        </div>

      </div>

    </AppLayout>

  );
}