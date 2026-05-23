import { useEffect, useState } from 'react';

import AppLayout from '../components/AppLayout';

import {
  fetchServices,
  createService
} from '../services/serviceService';

import {
  useAuthStore
} from '../store/authStore';

interface Service {
  id: number;
  name: string;
  description: string;
  service_price: number;
}

export default function ServicesPage() {

  const user = useAuthStore(
    (state) => state.user
  );

  const [services, setServices] =
    useState<Service[]>([]);

  const [name, setName] =
    useState('');

  const [description,
    setDescription] =
    useState('');

  const [servicePrice,
    setServicePrice] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const loadServices = async () => {

    try {

      const data =
        await fetchServices(
          user?.business_id
        );

      setServices(data);

    } catch (error) {

      console.error(
        'Failed to load services',
        error
      );

    }

  };

  useEffect(() => {

    if (user?.business_id) {

      loadServices();

    }

  }, [user]);

  const handleCreateService =
    async () => {

      if (
        !name ||
        !servicePrice
      ) {

        alert(
          'Please complete required fields.'
        );

        return;
      }

      try {

        setLoading(true);

        await createService({

          business_id:
            user?.business_id,

          name,

          description,

          service_price:
            Number(servicePrice)

        });

        alert(
          'Service created successfully!'
        );

        setName('');
        setDescription('');
        setServicePrice('');

        loadServices();

      } catch (error: any) {

        console.error(error);

        alert(
          error?.response?.data?.error ||
          'Service creation failed'
        );

      } finally {

        setLoading(false);

      }
  };

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
            Services
          </h1>

          <p className="
            text-sm
            text-zinc-500
            dark:text-zinc-400
            mt-1
          ">
            Manage MotorShop services and pricing.
          </p>

        </div>

        {/* Add Service Form */}

        <div className="
          bg-white
          dark:bg-zinc-900
          border
          border-zinc-200
          dark:border-zinc-800
          rounded-lg
          shadow-sm
          p-6
        ">

          <div className="mb-6">

            <h2 className="
              text-lg
              font-semibold
            ">
              Add New Service
            </h2>

            <p className="
              text-sm
              text-zinc-500
              dark:text-zinc-400
              mt-1
            ">
              Create and manage service offerings.
            </p>

          </div>

          <div className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-4
          ">

            <input
              type="text"
              placeholder="Service Name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              className="
                bg-white
                dark:bg-zinc-900
                border
                border-zinc-200
                dark:border-zinc-800
                rounded-md
                px-3
                py-2.5
                text-zinc-900
                dark:text-zinc-100
                focus:outline-none
                focus:ring-2
                focus:ring-zinc-300
                dark:focus:ring-zinc-700
              "
            />

            <input
              type="number"
              placeholder="Service Price"
              value={servicePrice}
              onChange={(e) =>
                setServicePrice(
                  e.target.value
                )
              }
              className="
                bg-white
                dark:bg-zinc-900
                border
                border-zinc-200
                dark:border-zinc-800
                rounded-md
                px-3
                py-2.5
                text-zinc-900
                dark:text-zinc-100
                focus:outline-none
                focus:ring-2
                focus:ring-zinc-300
                dark:focus:ring-zinc-700
              "
            />

            <button
              onClick={
                handleCreateService
              }
              disabled={loading}
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
                disabled:opacity-50
              "
            >
              {loading
                ? 'Saving...'
                : 'Add Service'}
            </button>

          </div>

          <textarea
            placeholder="
              Service Description
            "
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            rows={4}
            className="
              w-full
              mt-4
              bg-white
              dark:bg-zinc-900
              border
              border-zinc-200
              dark:border-zinc-800
              rounded-md
              px-3
              py-2.5
              text-zinc-900
              dark:text-zinc-100
              resize-none
              focus:outline-none
              focus:ring-2
              focus:ring-zinc-300
              dark:focus:ring-zinc-700
            "
          />

        </div>

        {/* Services Table */}

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

          <div className="
            px-6
            py-5
            border-b
            border-zinc-200
            dark:border-zinc-800
          ">

            <h2 className="
              text-lg
              font-semibold
            ">
              Available Services
            </h2>

            <p className="
              text-sm
              text-zinc-500
              dark:text-zinc-400
              mt-1
            ">
              Complete list of available services and pricing.
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
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                    text-zinc-500
                    dark:text-zinc-400
                  ">
                    Service Name
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                    text-zinc-500
                    dark:text-zinc-400
                  ">
                    Description
                  </th>

                  <th className="
                    px-6
                    py-4
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

                {services.length === 0 ? (

                  <tr>

                    <td
                      colSpan={3}
                      className="
                        px-6
                        py-12
                        text-center
                        text-zinc-500
                        dark:text-zinc-400
                      "
                    >
                      No services available.
                    </td>

                  </tr>

                ) : (

                  services.map((service) => (

                    <tr
                      key={service.id}
                      className="
                        border-b
                        border-zinc-100
                        dark:border-zinc-800
                        hover:bg-zinc-50
                        dark:hover:bg-zinc-800/50
                        transition
                      "
                    >

                      <td className="
                        px-6
                        py-4
                        font-medium
                      ">
                        {service.name}
                      </td>

                      <td className="
                        px-6
                        py-4
                        text-zinc-500
                        dark:text-zinc-400
                      ">
                        {service.description}
                      </td>

                      <td className="
                        px-6
                        py-4
                        font-medium
                      ">
                        ₱
                        {Number(
                          service.service_price
                        ).toFixed(2)}
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