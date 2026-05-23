import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import AppLayout from '../components/AppLayout';

import {
  useAuthStore
} from '../store/authStore';

import {
  fetchProducts,
  createProduct
} from '../services/productService';

interface Product {
  id: number;
  business_id: number;
  name: string;
  sku_barcode: string;
  category: string;
  cost_price: number;
  selling_price: number;
  stock_quantity: number;
  low_stock_threshold: number;
}

export default function InventoryPage() {

  const navigate = useNavigate();

  const user = useAuthStore(
    (state) => state.user
  );

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [newProduct, setNewProduct] =
    useState({
      name: '',
      sku_barcode: '',
      category: '',
      cost_price: '',
      selling_price: '',
      stock_quantity: '',
      low_stock_threshold: ''
    });

  useEffect(() => {

    const loadProducts = async () => {

      try {

        const data =
          await fetchProducts(
            Number(user?.business_id)
          );

        setProducts(data);

      } catch (error) {

        console.error(
          'Failed to load products',
          error
        );

      } finally {

        setLoading(false);

      }
    };

    if (user?.business_id) {

      loadProducts();

    }

  }, [user]);

  const handleAddProduct = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      await createProduct({
        business_id: Number(
          user?.business_id
        ),
        name: newProduct.name,
        sku_barcode:
          newProduct.sku_barcode,
        category:
          newProduct.category,
        cost_price: Number(
          newProduct.cost_price
        ),
        selling_price: Number(
          newProduct.selling_price
        ),
        stock_quantity: Number(
          newProduct.stock_quantity
        ),
        low_stock_threshold: Number(
          newProduct.low_stock_threshold
        )
      });

      const updatedProducts =
        await fetchProducts(
          Number(user?.business_id)
        );

      setProducts(updatedProducts);

      setShowAddModal(false);

      setNewProduct({
        name: '',
        sku_barcode: '',
        category: '',
        cost_price: '',
        selling_price: '',
        stock_quantity: '',
        low_stock_threshold: '5'
      });

    } catch (error) {

      console.error(
        'Failed to add product',
        error
      );

    }
  };

  if (loading) {

    return (

      <AppLayout>

        <div className="
          flex
          items-center
          justify-center
          h-full
        ">

          <p className="
            text-zinc-500
            dark:text-zinc-400
          ">
            Loading inventory...
          </p>

        </div>

      </AppLayout>

    );
  }

  return (

    <AppLayout>

      <div className="space-y-6">

        {/* Add Product Modal */}

        {showAddModal && (

          <div className="
            fixed
            inset-0
            bg-black/50
            flex
            items-center
            justify-center
            z-50
            p-4
          ">

            <div className="
              bg-white
              dark:bg-zinc-900
              rounded-lg
              p-6
              w-full
              max-w-md
              border
              border-zinc-200
              dark:border-zinc-800
            ">

              <h2 className="
                text-xl
                font-semibold
                mb-4
              ">
                Add New Product
              </h2>

              <form
                onSubmit={handleAddProduct}
                className="space-y-4"
              >

                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      name: e.target.value
                    })
                  }
                  className="
                    w-full
                    border
                    border-zinc-300
                    dark:border-zinc-700
                    rounded-md
                    px-3
                    py-2
                    bg-transparent
                  "
                  required
                />

                <input
                  type="text"
                  placeholder="SKU / Barcode"
                  value={newProduct.sku_barcode}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      sku_barcode: e.target.value
                    })
                  }
                  className="
                    w-full
                    border
                    border-zinc-300
                    dark:border-zinc-700
                    rounded-md
                    px-3
                    py-2
                    bg-transparent
                  "
                  required
                />

                <input
                  type="text"
                  placeholder="Category (Example: Construction)"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      category: e.target.value
                    })
                  }
                  className="
                    w-full
                    border
                    border-zinc-300
                    dark:border-zinc-700
                    rounded-md
                    px-3
                    py-2
                    bg-transparent
                  "
                />

                <input
                  type="number"
                  placeholder="Cost Price"
                  value={newProduct.cost_price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      cost_price: e.target.value
                    })
                  }
                  className="
                    w-full
                    border
                    border-zinc-300
                    dark:border-zinc-700
                    rounded-md
                    px-3
                    py-2
                    bg-transparent
                  "
                  required
                />

                <input
                  type="number"
                  placeholder="Selling Price"
                  value={newProduct.selling_price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      selling_price: e.target.value
                    })
                  }
                  className="
                    w-full
                    border
                    border-zinc-300
                    dark:border-zinc-700
                    rounded-md
                    px-3
                    py-2
                    bg-transparent
                  "
                  required
                />

                <input
                  type="number"
                  placeholder="Stock Quantity"
                  value={newProduct.stock_quantity}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      stock_quantity: e.target.value
                    })
                  }
                  className="
                    w-full
                    border
                    border-zinc-300
                    dark:border-zinc-700
                    rounded-md
                    px-3
                    py-2
                    bg-transparent
                  "
                  required
                />

                <input
                  type="number"
                  placeholder="Low Stock Threshold (Example: 5)"
                  value={
                    newProduct.low_stock_threshold
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      low_stock_threshold:
                        e.target.value
                    })
                  }
                  className="
                    w-full
                    border
                    border-zinc-300
                    dark:border-zinc-700
                    rounded-md
                    px-3
                    py-2
                    bg-transparent
                  "
                />

                <div className="
                  flex
                  justify-end
                  gap-3
                  pt-2
                ">

                  <button
                    type="button"
                    onClick={() =>
                      setShowAddModal(false)
                    }
                    className="
                      px-4
                      py-2
                      rounded-md
                      border
                      border-zinc-300
                      dark:border-zinc-700
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="
                      bg-blue-600
                      text-white
                      px-4
                      py-2
                      rounded-md
                      hover:bg-blue-700
                    "
                  >
                    Add Product
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

        {/* Page Header */}

        <div className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
        ">

          <div>

            <h1 className="
              text-3xl
              font-semibold
              tracking-tight
            ">
              Inventory
            </h1>

            <p className="
              text-sm
              text-zinc-500
              dark:text-zinc-400
              mt-1
            ">
              Monitor and manage inventory stock levels.
            </p>

          </div>

          <div className="
            flex
            flex-col
            sm:flex-row
            gap-3
          ">

            <button
              onClick={() =>
                setShowAddModal(true)
              }
              className="
                bg-blue-600
                text-white
                px-4
                py-2.5
                rounded-md
                text-sm
                font-medium
                transition
                hover:bg-blue-700
              "
            >
              Add Item
            </button>

            <button
              onClick={() =>
                navigate('/restock')
              }
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
              "
            >
              Restock Inventory
            </button>

          </div>

        </div>

        {/* Inventory Table */}

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
              Product Inventory
            </h2>

            <p className="
              text-sm
              text-zinc-500
              dark:text-zinc-400
              mt-1
            ">
              View current product pricing and stock availability.
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
                    Product Name
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
                    Selling Price
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
                    Stock Quantity
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
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {products.length === 0 ? (

                  <tr>

                    <td
                      colSpan={4}
                      className="
                        px-6
                        py-12
                        text-center
                        text-zinc-500
                        dark:text-zinc-400
                      "
                    >
                      No inventory products found.
                    </td>

                  </tr>

                ) : (

                  products.map((product) => (

                    <tr
                      key={product.id}
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
                        {product.name}
                      </td>

                      <td className="
                        px-6
                        py-4
                      ">
                        ₱
                        {Number(
                          product.selling_price
                        ).toFixed(2)}
                      </td>

                      <td className="
                        px-6
                        py-4
                      ">

                        <span
                          className={
                            product.stock_quantity <=
                            product.low_stock_threshold
                              ? 'text-red-600 font-semibold'
                              : ''
                          }
                        >
                          {product.stock_quantity}
                        </span>

                      </td>

                      <td className="
                        px-6
                        py-4
                      ">

                        {product.stock_quantity <=
                          product.low_stock_threshold ? (

                          <span className="
                            inline-flex
                            items-center
                            bg-red-100
                            dark:bg-red-500/10
                            text-red-700
                            dark:text-red-400
                            border
                            border-red-200
                            dark:border-red-500/20
                            px-3
                            py-1
                            rounded-md
                            text-xs
                            font-medium
                          ">
                            Low Stock
                          </span>

                        ) : (

                          <span className="
                            inline-flex
                            items-center
                            bg-emerald-100
                            dark:bg-emerald-500/10
                            text-emerald-700
                            dark:text-emerald-400
                            border
                            border-emerald-200
                            dark:border-emerald-500/20
                            px-3
                            py-1
                            rounded-md
                            text-xs
                            font-medium
                          ">
                            In Stock
                          </span>

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

    </AppLayout>

  );
}