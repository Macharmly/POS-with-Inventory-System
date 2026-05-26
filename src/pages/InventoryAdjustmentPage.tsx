import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import AppLayout from '../components/AppLayout';

import {
  fetchProducts
} from '../services/productService';

import {
  adjustInventory
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

export default function InventoryAdjustmentPage() {

  const navigate = useNavigate();

  const user = useAuthStore(
    (state) => state.user
  );

  const [products, setProducts] =
    useState<Product[]>([]);

  const [selectedProduct,
    setSelectedProduct] =
    useState('');

  const [adjustmentQuantity,
    setAdjustmentQuantity] =
    useState(0);

  const [reason, setReason] =
    useState('');

  const [loading, setLoading] =
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

  const handleAdjustment = async () => {

    if (!selectedProduct) {

      alert(
        'Please select a product.'
      );

      return;
    }

    if (adjustmentQuantity === 0) {

      alert(
        'Adjustment quantity cannot be zero.'
      );

      return;
    }

    if (!reason.trim()) {

      alert(
        'Please provide an adjustment reason.'
      );

      return;
    }

    try {

      setLoading(true);

      await adjustInventory({

        product_id:
          Number(selectedProduct),

        adjustment_quantity:
          adjustmentQuantity,

        reason,

        user_id: user?.id,

        business_id:
          user?.business_id

      });

      alert(
        'Inventory adjusted successfully!'
      );

      navigate('/inventory');

    } catch (error: any) {

      console.error(error);

      alert(
        error?.response?.data?.error ||
        'Inventory adjustment failed'
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
            Inventory Adjustment
          </h1>

          <p className="
            text-sm
            text-zinc-500
            dark:text-zinc-400
            mt-1
          ">
            Correct stock discrepancies and record inventory changes.
          </p>

        </div>

        {/* Form */}

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

            {/* Product Selection */}

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

            {/* Adjustment Quantity */}

            <div>

              <label className="
                block
                text-sm
                font-medium
                mb-2
              ">
                Adjustment Quantity
              </label>

              <input
                type="number"
                value={adjustmentQuantity}
                onChange={(e) =>
                  setAdjustmentQuantity(
                    Number(e.target.value)
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
              />

              <p className="
                text-sm
                text-zinc-500
                dark:text-zinc-400
                mt-2
              ">
                Positive numbers increase stock.
                Negative numbers reduce stock.
              </p>

            </div>

            {/* Reason */}

            <div>

              <label className="
                block
                text-sm
                font-medium
                mb-2
              ">
                Adjustment Reason
              </label>

              <textarea
                value={reason}
                onChange={(e) =>
                  setReason(
                    e.target.value
                  )
                }
                rows={4}
                placeholder="Example:
                  Damaged products,
                  manual correction,
                  expired items...
                "
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
                  resize-none
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
                onClick={handleAdjustment}
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
                  : 'Save Adjustment'}
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