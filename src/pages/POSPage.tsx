import { useEffect, useState } from 'react';

import {
  ShoppingCart,
  X
} from 'lucide-react';

import AppLayout from '../components/AppLayout';

import { useAuthStore } from '../store/authStore';

import {
  Product,
  Service,
  CartItem
}
from '../types/product';

import { fetchProducts } from '../services/productService';

import {
  fetchServices
}
from '../services/serviceService';

import { checkoutSale } from '../services/salesService';

import ReceiptModal from '../components/ReceiptModal';

export default function POSPage() {

  const user = useAuthStore(
    (state) => state.user
  );

  const [products, setProducts] =
    useState<Product[]>([]);

  const [checkingOut, setCheckingOut] =
    useState(false);

  const [services, setServices] =
    useState<Service[]>([]);

  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState('');

  const [receipt, setReceipt] =
    useState<any>(null);

  const [search, setSearch] =
    useState('');

  const [discountAmountInput,
    setDiscountAmountInput] =
    useState('');

  const [paymentMethod,
    setPaymentMethod] =
    useState('cash');

  const [cashReceived,
    setCashReceived] =
    useState('');

  const [mobileCartOpen,
    setMobileCartOpen] =
    useState(false);

  useEffect(() => {

    if (user?.business_id) {

      loadProducts();

      if (
        user.business_id === 2
      ) {

        loadServices();

      }

    }

  }, [user]);

  const loadProducts = async () => {

    try {

      const data = await fetchProducts(
        Number(user?.business_id)
      );

      setProducts(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  const loadServices = async () => {

    try {

      const data =
        await fetchServices(
          Number(
            user?.business_id
          )
        );

      setServices(data);

    } catch (error) {

      console.error(
        'Failed to load services',
        error
      );

    }

  };

  // Search Filter

  const filteredProducts =
    products.filter((product) =>

      product.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )

      ||

      product.sku_barcode
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

      ||

      product.category
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );

  const addToCart = (
    product: Product
  ) => {

    if (product.stock_quantity <= 0) {

      alert('Out of stock!');

      return;

    }

    setCart((prevCart) => {

      const existing = prevCart.find(
        (item) => item.id === product.id
      );

      if (existing) {

        if (
          existing.quantity >=
          product.stock_quantity
        ) {

          alert(
            'Cannot exceed available stock.'
          );

          return prevCart;

        }

        return prevCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        );

      }

      return [
        {
          ...product,
          quantity: 1,
          item_type: 'product'
        },
        ...prevCart
      ];

    });

  };

  const addServiceToCart = (
    service: Service
  ) => {

    setCart((prevCart) => {

      const existing =
        prevCart.find(

          (item) =>

            item.id === service.id &&

            item.item_type ===
            'service'

        );

      if (existing) {

        return prevCart.map(
          (item) =>

            item.id === service.id &&
            item.item_type ===
              'service'

              ? {
                  ...item,
                  quantity:
                    item.quantity + 1
                }

              : item
        );

      }

      return [

        {
          id: service.id,

          name: service.name,

          quantity: 1,

          item_type:
            'service',

          service_price:
            service.service_price
        },

        ...prevCart

      ];

    });

  };

  const removeFromCart = (
    id: number,
    itemType: string
  ) => {

    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(
          item.id === id &&
          item.item_type === itemType
        )
      )
    );

  };

  // Totals

  const cartTotal = cart.reduce(

    (sum, item) =>

      sum +

      Number(

        item.item_type === 'service'

          ? item.service_price

          : item.selling_price

      ) *

      item.quantity,

    0

  );

  const discountAmount =
    Number(discountAmountInput) || 0;

  const finalTotal =
    Math.max(
      cartTotal - discountAmount,
      0
    );

  const cashAmount =
    Number(cashReceived) || 0;

  const change =
    cashAmount - finalTotal;

  const handleCheckout = async () => {

    if (cart.length === 0) {

      alert('Cart is empty.');

      return;

    }

    if (!user) return;

    if (
      paymentMethod === 'cash' &&
      cashAmount < finalTotal
    ) {

      setMessage(
        'Insufficient cash received.'
      );

      return;

    }

    try {

      setCheckingOut(true);

      const response =
        await checkoutSale({

          business_id:
            user.business_id,

          user_id:
            user.id,

          items:
            cart,

          total_amount:
            finalTotal,

          discount_amount:
            discountAmount,

          payment_method:
            paymentMethod,

          cash_received:
            cashAmount,

          change_amount:
            change

        });

      setReceipt({

        ...response.receipt,

        cashReceived:
          cashAmount,

        change:
          change

      });

      setMessage(
        response.message
      );

      setCart([]);

      setDiscountAmountInput('');

      setCashReceived('');

      setPaymentMethod('cash');

      setMobileCartOpen(false);

      loadProducts();

      if (user.business_id === 2) {

        loadServices();

      }

    } catch (err: any) {

      setMessage(
        err.response?.data?.error ||
        'Checkout failed.'
      );

    } finally {

      setCheckingOut(false);

    }
  };

  if (loading) {

    return (

      <AppLayout>

        <div
          className="
            flex
            items-center
            justify-center
            h-[60vh]
          "
        >

          <p
            className="
              text-zinc-500
              dark:text-zinc-400
            "
          >
            Loading POS...
          </p>

        </div>

      </AppLayout>

    );
  }

  const CartContent = () => {

    return (

    <>

      {/* Header */}

      <div
        className="
          border-b
          border-zinc-200
          dark:border-zinc-800
          pb-4
          flex
          items-center
          justify-between
        "
      >

        <div>

          <h2
            className="
              text-lg
              font-semibold
            "
          >
            Cart
          </h2>

          <p
            className="
              text-sm
              text-zinc-500
              dark:text-zinc-400
              mt-1
            "
          >
            Current customer transaction.
          </p>

        </div>

        {/* Close Button */}

        <button
          onClick={() =>
            setMobileCartOpen(false)
          }
          className="
            lg:hidden
            h-10
            w-10
            flex
            items-center
            justify-center
            rounded-xl
            hover:bg-zinc-100
            dark:hover:bg-zinc-800
            transition
          "
        >

          <X size={20} />

        </button>

      </div>

      {/* Success Message */}

      {message && (

        <div
          className="
            mt-4
            bg-emerald-100
            dark:bg-emerald-500/10
            text-emerald-700
            dark:text-emerald-400
            border
            border-emerald-200
            dark:border-emerald-500/20
            rounded-xl
            p-3
            text-sm
          "
        >
          {message}
        </div>

      )}

      {/* Cart Items */}

      <div
        className="
          flex-1
          mt-4
          overflow-y-auto
          space-y-4
        "
      >

        {cart.length === 0 && (

          <p
            className="
              text-sm
              text-zinc-500
              dark:text-zinc-400
            "
          >
            Cart is empty.
          </p>

        )}

        {cart.map((item) => (

          <div
            key={item.id}
            className="
              border
              border-zinc-200
              dark:border-zinc-800
              rounded-xl
              p-3
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
                gap-2
              "
            >

              <div className="min-w-0">

                <div className="flex items-center gap-2">

                  <span
                    className={`
                      text-[10px]
                      px-2
                      py-1
                      rounded-full
                      font-semibold

                      ${
                        item.item_type === 'service'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }
                    `}
                  >

                    {item.item_type === 'service'
                      ? 'SERVICE'
                      : 'PRODUCT'}

                  </span>

                  <p
                    className="
                      font-medium
                      truncate
                    "
                  >
                    {item.name}
                  </p>

                </div>

                <p
                  className="
                    text-sm
                    text-zinc-500
                    dark:text-zinc-400
                    mt-1
                  "
                >
                  ₱
                  {Number(

                    item.item_type === 'service'

                      ? item.service_price

                      : item.selling_price

                  ).toFixed(2)}

                  {' '}×{' '}

                  {item.quantity}
                </p>

              </div>

              <button
                onClick={() =>
                  removeFromCart(
                    item.id,
                    item.item_type
                  )
                }
                className="
                  text-red-500
                  hover:text-red-600
                  text-lg
                  transition
                  shrink-0
                "
              >
                ×
              </button>

            </div>

            <div
              className="
                flex
                items-center
                justify-between
                mt-3
                gap-3
              "
            >

              {/* Quantity Controls */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                {/* Minus */}

                <button
                  onClick={() => {

                    setCart((prevCart) =>
                      prevCart
                        .map((cartItem) => {

                          if (

                            cartItem.id === item.id &&

                            cartItem.item_type ===
                            item.item_type

                          ) {

                            return {
                              ...cartItem,
                              quantity:
                                cartItem.quantity - 1
                            };

                          }

                          return cartItem;

                        })
                        .filter(
                          (cartItem) =>
                            cartItem.quantity > 0
                        )
                    );

                  }}
                  className="
                    h-7
                    w-7
                    rounded-full
                    bg-zinc-100
                    dark:bg-zinc-800
                    flex
                    items-center
                    justify-center
                    text-xs
                    font-bold
                  "
                >
                  -
                </button>

                {/* Quantity */}

                <span
                  className="
                    text-sm
                    font-medium
                    min-w-[20px]
                    text-center
                  "
                >
                  {item.quantity}
                </span>

                {/* Plus */}

                <button
                  onClick={() => {

                    if (

                      item.item_type === 'product' &&

                      item.stock_quantity !== undefined &&

                      item.quantity >= item.stock_quantity

                    ) {

                      alert(
                        'Cannot exceed available stock.'
                      );

                      return;

                    }

                    setCart((prevCart) =>
                      prevCart.map(
                        (cartItem) =>

                          cartItem.id === item.id &&
                          cartItem.item_type === item.item_type

                            ? {
                                ...cartItem,
                                quantity:
                                  cartItem.quantity + 1
                              }

                            : cartItem
                      )
                    );

                  }}
                  className="
                    h-7
                    w-7
                    rounded-full
                    bg-zinc-100
                    dark:bg-zinc-800
                    flex
                    items-center
                    justify-center
                    text-xs
                    font-bold
                  "
                >
                  +
                </button>

              </div>

              {/* Item Total */}

              <span
                className="
                  text-sm
                  font-semibold
                  shrink-0
                "
              >

                ₱
                {(
                  Number(

                    item.item_type === 'service'

                      ? item.service_price

                      : item.selling_price

                  ) *

                  item.quantity

                ).toFixed(2)}

              </span>

            </div>

          </div>

        ))}

      </div>

      {/* Checkout */}

      {cart.length > 0 && (

        <div
          className="
            border-t
            border-zinc-200
            dark:border-zinc-800
            pt-4
            mt-6
            space-y-4
          "
        >

          {/* Payment Method */}

          <div className="space-y-2">

            <label
              className="
                text-sm
                font-medium
                text-zinc-700
                dark:text-zinc-300
              "
            >
              Payment Method
            </label>

            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(
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
                rounded-xl
                px-4
                py-3
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-zinc-300
                dark:focus:ring-zinc-700
              "
            >

              <option value="cash">
                Cash
              </option>

              <option value="gcash">
                GCash
              </option>

              <option value="banktransfer">
                Bank Transfer
              </option>

            </select>

          </div>

          {/* Cash Received */}

          <div
            className={`
              space-y-2
              ${
                paymentMethod === 'cash'
                  ? 'block'
                  : 'hidden'
              }
            `}
          >

            <label
              className="
                text-sm
                font-medium
                text-zinc-700
                dark:text-zinc-300
              "
            >
              Cash Received
            </label>

            <input
              type="number"
              min={0}
              value={cashReceived}
              onChange={(e) =>
                setCashReceived(
                  e.target.value
                )
              }
              placeholder="Enter cash amount"
              className="
                w-full
                bg-white
                dark:bg-zinc-900
                border
                border-zinc-200
                dark:border-zinc-800
                rounded-xl
                px-4
                py-3
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-zinc-300
                dark:focus:ring-zinc-700
              "
            />

          </div>

          {/* Discount */}

          <div className="space-y-2">

            <label
              className="
                text-sm
                font-medium
                text-zinc-700
                dark:text-zinc-300
              "
            >
              Discount Amount (₱)
            </label>

            <input
              type="number"
              min={0}
              max={cartTotal}
              value={discountAmountInput}
              onChange={(e) => {

                const value =
                  e.target.value;

                if (value === '') {

                  setDiscountAmountInput('');

                  return;

                }

                const numericValue =
                  Number(value);

                if (
                  numericValue >= 0 &&
                  numericValue <= cartTotal
                ) {

                  setDiscountAmountInput(value);

                }

              }}
              placeholder="Enter discount amount"
              className="
                w-full
                bg-white
                dark:bg-zinc-900
                border
                border-zinc-200
                dark:border-zinc-800
                rounded-xl
                px-4
                py-3
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-zinc-300
                dark:focus:ring-zinc-700
              "
            />

          </div>

          {/* Totals */}

          <div className="space-y-3">

            <div
              className="
                flex
                justify-between
                items-center
              "
            >

              <span
                className="
                  text-sm
                  text-zinc-500
                  dark:text-zinc-400
                "
              >
                Subtotal
              </span>

              <span className="font-medium">

                ₱
                {cartTotal.toFixed(2)}

              </span>

            </div>

            <div
              className="
                flex
                justify-between
                items-center
              "
            >

              <span
                className="
                  text-sm
                  text-zinc-500
                  dark:text-zinc-400
                "
              >
                Discount
              </span>

              <span
                className="
                  font-medium
                  text-red-500
                "
              >

                - ₱
                {discountAmount.toFixed(2)}

              </span>

            </div>

            <div
              className="
                flex
                justify-between
                items-center
                pt-4
                border-t
                border-zinc-200
                dark:border-zinc-800
              "
            >

              <span
                className="
                  text-sm
                  font-medium
                  text-zinc-500
                  dark:text-zinc-400
                "
              >
                Final Total
              </span>

              <span
                className="
                  text-2xl
                  font-semibold
                "
              >

                ₱
                {finalTotal.toFixed(2)}

              </span>

            </div>

            {/* Change */}

            {paymentMethod === 'cash' &&
            cashReceived && (

              <div
                className="
                  flex
                  justify-between
                  items-center
                  pt-2
                "
              >

                <span
                  className="
                    text-sm
                    font-medium
                    text-zinc-500
                    dark:text-zinc-400
                  "
                >
                  Change
                </span>

                <span
                  className={`
                    text-lg
                    font-semibold
                    ${
                      change < 0
                        ? 'text-red-500'
                        : 'text-emerald-500'
                    }
                  `}
                >

                  ₱
                  {Math.abs(change).toFixed(2)}

                </span>

              </div>

            )}

          </div>

          <button
            onClick={handleCheckout}
            disabled={checkingOut}
            className="
              w-full
              bg-zinc-900
              dark:bg-zinc-100
              text-white
              dark:text-zinc-900
              py-3.5
              rounded-xl
              text-sm
              font-medium
              transition
              hover:opacity-90
            "
          >
            {checkingOut
              ? 'Processing...'
              : 'Complete Sale'}
          </button>

        </div>

      )}

    </>

    );
    };

  return (

    <AppLayout>

      <div className="space-y-6">

        {/* Header */}

        <div>

          <h1
            className="
              text-2xl
              sm:text-3xl
              font-semibold
              tracking-tight
            "
          >
            Point of Sale
          </h1>

          <p
            className="
              text-sm
              text-zinc-500
              dark:text-zinc-400
              mt-1
            "
          >
            Handle customer checkout transactions.
          </p>

        </div>

        {/* Desktop Layout */}

        <div
          className="
            hidden
            lg:grid
            lg:grid-cols-3
            gap-6
          "
        >

          {/* Products */}

          <div
            className="
              lg:col-span-2
              bg-white
              dark:bg-zinc-900
              border
              border-zinc-200
              dark:border-zinc-800
              rounded-2xl
              shadow-sm
              overflow-hidden
            "
          >

            {/* Search */}

            <div
              className="
                px-6
                py-4
                border-b
                border-zinc-200
                dark:border-zinc-800
              "
            >

              <input
                type="text"
                placeholder="Search by product, SKU, or category..."
                value={search}
                onChange={(e) =>
                  setSearch(
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
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-zinc-300
                  dark:focus:ring-zinc-700
                "
              />

            </div>

            {user?.business_id === 2 &&
            services.length > 0 && (

              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">

                <h2 className="text-lg font-semibold mb-4">
                  Services
                </h2>

                <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">

                  {services.map((service) => (

                    <button
                      key={service.id}
                      onClick={() =>
                        addServiceToCart(
                          service
                        )
                      }
                      className="
                        border
                        border-blue-200
                        dark:border-blue-900
                        rounded-2xl
                        p-4
                        text-left
                        transition
                        hover:bg-blue-50
                        dark:hover:bg-blue-950/30
                      "
                    >

                      <h3 className="font-semibold">
                        {service.name}
                      </h3>

                      <p className="
                        text-sm
                        text-zinc-500
                        dark:text-zinc-400
                        mt-2
                      ">
                        {service.description}
                      </p>

                      <p className="
                        mt-3
                        font-semibold
                        text-blue-600
                      ">
                        ₱
                        {Number(
                          service.service_price
                        ).toFixed(2)}
                      </p>

                      {service.linked_products &&
                        service.linked_products.length > 0 && (

                        <div className="mt-4">

                          <p className="
                            text-xs
                            font-semibold
                            text-zinc-500
                            mb-2
                          ">
                            Suggested Products
                          </p>

                          <div className="
                            flex
                            flex-wrap
                            gap-2
                          ">

                            {service.linked_products
                              .slice(0, 4)
                              .map((product) => (

                                <button
                                  key={product.id}

                                  onClick={(e) => {

                                    e.stopPropagation();

                                    addToCart(
                                      product
                                    );

                                  }}

                                  className="
                                    text-xs
                                    px-2
                                    py-1
                                    rounded-lg
                                    bg-emerald-100
                                    text-emerald-700
                                    hover:bg-emerald-200
                                  "
                                >

                                  {product.name}

                                </button>

                            ))}

                          </div>

                        </div>

                      )}

                    </button>

                  ))}

                </div>

              </div>

            )}

            {/* Product Grid */}

            <div
              className="
                p-4
                grid
                grid-cols-2
                xl:grid-cols-3
                gap-4
              "
            >

              {filteredProducts.map((product) => (

                <button
                  key={product.id}
                  onClick={() =>
                    addToCart(product)
                  }
                  className="
                    border
                    border-zinc-200
                    dark:border-zinc-800
                    rounded-2xl
                    p-4
                    text-left
                    transition
                    hover:bg-zinc-50
                    dark:hover:bg-zinc-800
                  "
                >

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-3
                    "
                  >

                    <div className="min-w-0">

                      <h3
                        className="
                          font-semibold
                          truncate
                        "
                      >
                        {product.name}
                      </h3>

                      <p
                        className="
                          text-xs
                          text-zinc-500
                          dark:text-zinc-400
                          mt-1
                        "
                      >
                        {product.sku_barcode}
                      </p>

                    </div>

                    <span
                      className="
                        text-sm
                        font-semibold
                        shrink-0
                      "
                    >
                      ₱
                      {Number(
                        product.selling_price
                      ).toFixed(2)}
                    </span>

                  </div>

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      mt-4
                    "
                  >

                    <span
                      className="
                        inline-flex
                        items-center
                        px-2.5
                        py-1
                        rounded-lg
                        text-xs
                        font-medium
                        bg-zinc-100
                        dark:bg-zinc-800
                      "
                    >
                      {product.category}
                    </span>

                    <span
                      className={`
                        text-sm
                        ${
                          product.stock_quantity <= 5
                            ? 'text-red-600 font-semibold'
                            : 'text-zinc-500 dark:text-zinc-400'
                        }
                      `}
                    >
                      Stock:
                      {' '}
                      {product.stock_quantity}
                    </span>

                  </div>

                </button>

              ))}

            </div>

          </div>

          {/* Desktop Cart */}

          <div
            className="
              bg-white
              dark:bg-zinc-900
              border
              border-zinc-200
              dark:border-zinc-800
              rounded-2xl
              shadow-sm
              p-6
              flex
              flex-col
              sticky
              top-6
              h-[calc(100vh-80px)]
            "
          >

            {CartContent()}

          </div>

        </div>

        {/* Mobile + Tablet Layout */}

        <div className="lg:hidden">

          <div
            className="
              bg-white
              dark:bg-zinc-900
              border
              border-zinc-200
              dark:border-zinc-800
              rounded-2xl
              shadow-sm
              overflow-hidden
            "
          >

            {/* Search */}

            <div
              className="
                px-4
                sm:px-6
                py-4
                border-b
                border-zinc-200
                dark:border-zinc-800
              "
            >

              <input
                type="text"
                placeholder="Search by product, SKU, or category..."
                value={search}
                onChange={(e) =>
                  setSearch(
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
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-zinc-300
                  dark:focus:ring-zinc-700
                "
              />

            </div>

            {/* Product Grid */}

            <div
              className="
                p-4
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-4
              "
            >

              {filteredProducts.map((product) => (

                <button
                  key={product.id}
                  onClick={() =>
                    addToCart(product)
                  }
                  className="
                    border
                    border-zinc-200
                    dark:border-zinc-800
                    rounded-2xl
                    p-4
                    text-left
                    transition
                    hover:bg-zinc-50
                    dark:hover:bg-zinc-800
                  "
                >

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-3
                    "
                  >

                    <div className="min-w-0">

                      <h3
                        className="
                          font-semibold
                          truncate
                        "
                      >
                        {product.name}
                      </h3>

                      <p
                        className="
                          text-xs
                          text-zinc-500
                          dark:text-zinc-400
                          mt-1
                        "
                      >
                        {product.sku_barcode}
                      </p>

                    </div>

                    <span
                      className="
                        text-sm
                        font-semibold
                        shrink-0
                      "
                    >
                      ₱
                      {Number(
                        product.selling_price
                      ).toFixed(2)}
                    </span>

                  </div>

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      mt-4
                    "
                  >

                    <span
                      className="
                        inline-flex
                        items-center
                        px-2.5
                        py-1
                        rounded-lg
                        text-xs
                        font-medium
                        bg-zinc-100
                        dark:bg-zinc-800
                      "
                    >
                      {product.category}
                    </span>

                    <span
                      className={`
                        text-sm
                        ${
                          product.stock_quantity <= 5
                            ? 'text-red-600 font-semibold'
                            : 'text-zinc-500 dark:text-zinc-400'
                        }
                      `}
                    >
                      Stock:
                      {' '}
                      {product.stock_quantity}
                    </span>

                  </div>

                </button>

              ))}

            </div>

          </div>

        </div>

      </div>

      {/* Floating Cart Button */}

      <button
        onClick={() =>
          setMobileCartOpen(true)
        }
        className="
          lg:hidden
          fixed
          bottom-5
          right-5
          z-50
          flex
          items-center
          gap-2
          bg-zinc-900
          dark:bg-zinc-100
          text-white
          dark:text-zinc-900
          rounded-full
          px-5
          py-3.5
          shadow-2xl
        "
      >

        <ShoppingCart size={18} />

        <span
          className="
            text-sm
            font-medium
          "
        >
          Cart ({cart.length})
        </span>

      </button>

      {/* Mobile + Tablet Cart Drawer */}

      {mobileCartOpen && (

        <div
          className="
            fixed
            inset-0
            z-50
            lg:hidden
          "
        >

          {/* Backdrop */}

          <div
            className="
              absolute
              inset-0
              bg-black/50
              backdrop-blur-sm
            "
            onClick={() =>
              setMobileCartOpen(false)
            }
          />

          {/* Drawer */}

          <div
            className="
              absolute
              bottom-0
              left-0
              right-0
              h-[90vh]
              bg-white
              dark:bg-zinc-900
              rounded-t-3xl
              p-4
              flex
              flex-col
              overflow-hidden
            "
          >

            {/* Handle */}

            <div
              className="
                w-12
                h-1.5
                bg-zinc-300
                dark:bg-zinc-700
                rounded-full
                mx-auto
                mb-4
              "
            />

            {CartContent()}

          </div>

        </div>

      )}

      {/* Receipt Modal */}

      {receipt && (

        <ReceiptModal

          receipt={receipt}

          onClose={() =>
            setReceipt(null)
          }

        />

      )}

    </AppLayout>

  );
}