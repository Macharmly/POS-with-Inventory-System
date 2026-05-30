import { useEffect, useState } from 'react';

import AppLayout from '../components/AppLayout';

import {
  fetchProducts
}
from '../services/productService';

import {

  fetchServices,
  createService,
  updateService,
  deleteService,

  fetchServiceProducts,
  addServiceProduct,
  removeServiceProduct

} from '../services/serviceService';

import {
  useAuthStore
} from '../store/authStore';
import { Product } from '../types/product';

interface Service {
  id: number;
  name: string;
  description: string;
  service_price: number;

  linked_products?: Product[];
}

export default function ServicesPage() {

  const user = useAuthStore(
    (state) => state.user
  );

  const [
    productSearch,
    setProductSearch
  ] = useState('');

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

  const [products, setProducts] =
    useState<Product[]>([]);

  const [
    selectedService,
    setSelectedService
  ] = useState<Service | null>(
    null
  );

  const [
    linkedProducts,
    setLinkedProducts
  ] = useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [editName, setEditName] =
    useState('');

  const [editDescription,
    setEditDescription] =
    useState('');

  const [editPrice,
    setEditPrice] =
    useState('');

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

  const loadProducts = async () => {

    try {

      const data =
        await fetchProducts(
          Number(
            user?.business_id
          )
        );

      setProducts(data);

    } catch (error) {

      console.error(error);

    }

  };

  const openProductModal = async (
    service: Service
  ) => {

    try {

      setSelectedService(service);

      const data =
        await fetchServiceProducts(
          service.id
        );

      setLinkedProducts(data);

    } catch (error) {

      console.error(error);

      alert(
        'Failed to load linked products.'
      );

    }

  };

  useEffect(() => {

    if (user?.business_id) {

      loadServices();
      loadProducts();

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

  const handleEdit = (
    service: Service
  ) => {

    setEditingId(service.id);

    setEditName(service.name);

    setEditDescription(
      service.description || ''
    );

    setEditPrice(
      String(service.service_price)
    );

  };

  const handleUpdateService =
    async () => {

      if (!editingId) return;

      try {

        await updateService(

          editingId,

          {
            name: editName,
            description:
              editDescription,
            service_price:
              Number(editPrice)
          }

        );

        alert(
          'Service updated successfully!'
        );

        setEditingId(null);

        loadServices();

      } catch (error: any) {

        alert(
          error?.response?.data?.error ||
          'Failed to update service'
        );

      }

    };

  const handleDeleteService =
    async (
      id: number
    ) => {

      const confirmed =
        window.confirm(
          'Delete this service?'
        );

      if (!confirmed) return;

      try {

        await deleteService(id);

        alert(
          'Service deleted successfully!'
        );

        loadServices();

      } catch (error: any) {

        alert(
          error?.response?.data?.error ||
          'Failed to delete service'
        );

      }

    };

  const handleAddProduct =
    async (
      productId: number
    ) => {

      if (!selectedService)
        return;

      try {

        await addServiceProduct(

          selectedService.id,

          productId

        );

        const updated =
          await fetchServiceProducts(
            selectedService.id
          );

        setLinkedProducts(
          updated
        );

      } catch (error) {

        console.error(error);

        alert(
          'Failed to link product.'
        );

      }

    };

  const handleRemoveProduct =
    async (
      productId: number
    ) => {

      if (!selectedService)
        return;

      try {

        await removeServiceProduct(

          selectedService.id,

          productId

        );

        const updated =
          await fetchServiceProducts(
            selectedService.id
          );

        setLinkedProducts(
          updated
        );

      } catch (error) {

        console.error(error);

        alert(
          'Failed to remove product.'
        );

      }

    };

  const filteredProducts =
    products.filter((product) =>

      product.name
        .toLowerCase()
        .includes(
          productSearch.toLowerCase()
        )

    );

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
            placeholder="Service Description"
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
                    Linked Products
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
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {services.length === 0 ? (

                  <tr>

                    <td
                      colSpan={5}
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
                      "
                    >

                      <td className="px-6 py-4">

                        {editingId === service.id ? (

                          <input
                            value={editName}
                            onChange={(e) =>
                              setEditName(
                                e.target.value
                              )
                            }
                            className="
                              border
                              border-zinc-300
                              dark:border-zinc-700
                              rounded
                              px-2
                              py-1
                              w-full
                            "
                          />

                        ) : (

                          service.name

                        )}

                      </td>

                      <td className="px-6 py-4">

                        {editingId === service.id ? (

                          <input
                            value={editDescription}
                            onChange={(e) =>
                              setEditDescription(
                                e.target.value
                              )
                            }
                            className="
                              border
                              border-zinc-300
                              dark:border-zinc-700
                              rounded
                              px-2
                              py-1
                              w-full
                            "
                          />

                        ) : (

                          service.description

                        )}

                      </td>

                      <td className="px-6 py-4">

                        {editingId === service.id ? (

                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) =>
                              setEditPrice(
                                e.target.value
                              )
                            }
                            className="
                              border
                              border-zinc-300
                              dark:border-zinc-700
                              rounded
                              px-2
                              py-1
                              w-32
                            "
                          />

                        ) : (

                          <>
                            ₱
                            {Number(
                              service.service_price
                            ).toFixed(2)}
                          </>

                        )}

                      </td>

                      <td className="px-6 py-4">

                        <button
                          onClick={() =>
                            openProductModal(
                              service
                            )
                          }
                          className="
                            px-3
                            py-1
                            rounded
                            bg-purple-600
                            text-white
                            text-sm
                          "
                        >
                          Manage Products
                        </button>

                      </td>

                      <td className="px-6 py-4">

                        {editingId === service.id ? (

                          <div className="flex gap-2">

                            <button
                              onClick={
                                handleUpdateService
                              }
                              className="
                                px-3
                                py-1
                                rounded
                                bg-emerald-600
                                text-white
                                text-sm
                              "
                            >
                              Save
                            </button>

                            <button
                              onClick={() =>
                                setEditingId(null)
                              }
                              className="
                                px-3
                                py-1
                                rounded
                                bg-zinc-500
                                text-white
                                text-sm
                              "
                            >
                              Cancel
                            </button>

                          </div>

                        ) : (

                          <div className="flex gap-2">

                            <button
                              onClick={() =>
                                handleEdit(service)
                              }
                              className="
                                px-3
                                py-1
                                rounded
                                bg-blue-600
                                text-white
                                text-sm
                              "
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteService(
                                  service.id
                                )
                              }
                              className="
                                px-3
                                py-1
                                rounded
                                bg-red-600
                                text-white
                                text-sm
                              "
                            >
                              Delete
                            </button>

                          </div>

                        )}

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {selectedService && (

        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/50
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
          "
        >

          <div
            className="
              bg-white
              dark:bg-zinc-900
              rounded-3xl
              shadow-2xl
              w-full
              max-w-4xl
              h-[85vh]
              flex
              flex-col
              overflow-hidden
            "
          >

            {/* Header */}

            <div
              className="
                px-6
                py-5
                border-b
                border-zinc-200
                dark:border-zinc-800
                flex
                items-center
                justify-between
              "
            >

              <div>

                <h2
                  className="
                    text-xl
                    font-semibold
                  "
                >
                  {selectedService.name}
                </h2>

                <p
                  className="
                    text-sm
                    text-zinc-500
                    dark:text-zinc-400
                    mt-1
                  "
                >
                  Manage products used by this service.
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedService(null)
                }
                className="
                  h-10
                  w-10
                  rounded-xl
                  hover:bg-zinc-100
                  dark:hover:bg-zinc-800
                  transition
                "
              >
                ✕
              </button>

            </div>

            {/* Body */}

            <div
              className="
                flex-1
                overflow-hidden
                grid
                md:grid-cols-2
              "
            >

              {/* Linked Products */}

              <div
                className="
                  border-r
                  border-zinc-200
                  dark:border-zinc-800
                  p-6
                  overflow-y-auto
                "
              >

                <h3
                  className="
                    font-semibold
                    mb-4
                  "
                >
                  Linked Products
                </h3>

                {linkedProducts.length === 0 ? (

                  <div
                    className="
                      text-center
                      text-sm
                      text-zinc-500
                      mt-10
                    "
                  >
                    No linked products yet.
                  </div>

                ) : (

                  <div className="space-y-3">

                    {linkedProducts.map(
                      (product: any) => (

                        <div
                          key={product.id}
                          className="
                            flex
                            items-center
                            justify-between
                            border
                            border-zinc-200
                            dark:border-zinc-800
                            rounded-2xl
                            px-4
                            py-3
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
                              "
                            >
                              Stock:
                              {' '}
                              {product.stock_quantity}
                            </p>

                          </div>

                          <button
                            onClick={() =>
                              handleRemoveProduct(
                                product.id
                              )
                            }
                            className="
                              text-red-500
                              text-sm
                              font-medium
                            "
                          >
                            Remove
                          </button>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

              {/* Available Products */}

              <div
                className="
                  p-6
                  overflow-y-auto
                "
              >

                <h3
                  className="
                    font-semibold
                    mb-4
                  "
                >
                  Available Products
                </h3>

                {/* Search */}

                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) =>
                    setProductSearch(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    mb-4
                    bg-white
                    dark:bg-zinc-900
                    border
                    border-zinc-200
                    dark:border-zinc-800
                    rounded-2xl
                    px-4
                    py-3
                    text-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-zinc-300
                    dark:focus:ring-zinc-700
                  "
                />

                <div
                  className="
                    grid
                    gap-3
                  "
                >

                  {filteredProducts.map(
                    (product) => (

                      <button
                        key={product.id}
                        onClick={() =>
                          handleAddProduct(
                            product.id
                          )
                        }
                        className="
                          text-left
                          border
                          border-zinc-200
                          dark:border-zinc-800
                          rounded-2xl
                          p-4
                          hover:bg-zinc-50
                          dark:hover:bg-zinc-800
                          transition
                        "
                      >

                        <div
                          className="
                            flex
                            justify-between
                            items-center
                          "
                        >

                          <div>

                            <p
                              className="
                                font-medium
                              "
                            >
                              {product.name}
                            </p>

                            <p
                              className="
                                text-xs
                                text-zinc-500
                              "
                            >
                              {product.category}
                            </p>

                          </div>

                          <span
                            className="
                              text-sm
                              font-medium
                            "
                          >
                            Stock:
                            {' '}
                            {product.stock_quantity}
                          </span>

                        </div>

                      </button>

                    )
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </AppLayout>

  );
}