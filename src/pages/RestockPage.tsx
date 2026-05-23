import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import AppLayout from '../components/AppLayout';

import {
  fetchProducts
} from '../services/productService';

import {
  restockProduct
} from '../services/salesService';

import {
  useAuthStore
} from '../store/authStore';

interface Product {
  id: number;
  business_id: number;
  name: string;
  stock_quantity: number;
}

export default function RestockPage() {

  const navigate = useNavigate();

  const user = useAuthStore(
    (state) => state.user
  );

  const [products, setProducts] =
    useState<Product[]>([]);

  const [selectedProduct,
    setSelectedProduct] =
    useState('');

  const [quantity,
    setQuantity] =
    useState(1);

  const [loading,
    setLoading] =
    useState(false);

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

      }
    };

    if (user?.business_id) {

      loadProducts();

    }

  }, [user]);

  const handleRestock = async () => {

    if (!selectedProduct) {

      alert(
        'Please select a product.'
      );

      return;
    }

    if (quantity <= 0) {

      alert(
        'Quantity must be greater than 0.'
      );

      return;
    }

    try {

      setLoading(true);

      await restockProduct({

        product_id:
          Number(selectedProduct),

        quantity,

        user_id:
          user?.id,

        business_id:
          user?.business_id

      });

      alert(
        'Product restocked successfully!'
      );

      navigate('/inventory');

    } catch (error: any) {

      console.error(error);

      alert(
        error?.response?.data?.error ||
        'Restock failed'
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <AppLayout>

      <div className="
        max-w-2xl
        space-y-6
      ">

        {/* Page Header */}

        <div>

          <h1 className="
            text-3xl
            font-semibold
            tracking-tight
          ">
            Restock Inventory
          </h1>

          <p className="
            text-sm
            text-zinc-500
            dark:text-zinc-400
            mt-1
          ">
            Add inventory stock and replenish products.
          </p>

        </div>

        {/* Restock Form */}

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

          <div className="
            space-y-6
          ">

            {/* Product Select */}

            <div>

              <label className="
                block
                text-sm
                font-medium
                mb-2
              ">
                Select Product
              </label>

              <select
                value={selectedProduct}
                onChange={(e) =>
                  setSelectedProduct(
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
              >

                <option value="">
                  -- Choose Product --
                </option>

                {products.map((product) => (

                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name}
                    {' '}
                    (
                    Current Stock:
                    {' '}
                    {product.stock_quantity}
                    )
                  </option>

                ))}

              </select>

            </div>

            {/* Quantity */}

            <div>

              <label className="
                block
                text-sm
                font-medium
                mb-2
              ">
                Quantity to Add
              </label>

              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Number(e.target.value)
                  )
                }
                min={1}
                className="
                  w-full
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

            </div>

            {/* Actions */}

            <div className="
              flex
              items-center
              gap-3
              pt-2
            ">

              <button
                onClick={handleRestock}
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
                  ? 'Processing...'
                  : 'Restock Product'}
              </button>

              <button
                onClick={() =>
                  navigate('/inventory')
                }
                className="
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  bg-white
                  dark:bg-zinc-900
                  text-zinc-900
                  dark:text-zinc-100
                  px-4
                  py-2.5
                  rounded-md
                  text-sm
                  font-medium
                  transition
                  hover:bg-zinc-100
                  dark:hover:bg-zinc-800
                "
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      </div>

    </AppLayout>

  );
}