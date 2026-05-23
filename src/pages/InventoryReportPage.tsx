import { useEffect, useMemo, useState } from 'react';
import AppLayout from '../components/AppLayout';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

import { fetchProducts } from '../services/productService';
import { Product } from '../types/product';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function InventoryReportPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {

    try {

        setLoading(true);

        const businessId =
        localStorage.getItem('business_id');

        if (!businessId) {

        console.error(
            'Business ID not found'
        );

        return;

        }

        const data = await fetchProducts(
        Number(businessId)
        );

        setProducts(data || []);

    } catch (error) {

        console.error(
        'Error loading products:',
        error
        );

    } finally {

        setLoading(false);

    }

    };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const quantity = Number(product.stock_quantity || 0);

      const matchesStockFilter =
        stockFilter === 'all'
          ? true
          : stockFilter === 'low'
          ? quantity > 0 && quantity <= 10
          : quantity === 0;

      return matchesSearch && matchesStockFilter;
    });
  }, [products, search, stockFilter]);

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, product) => sum + Number(product.stock_quantity || 0),
    0
  );

  const totalInventoryValue = products.reduce((sum, product) => {
    const quantity = Number(product.stock_quantity || 0);
    const price = Number(product.selling_price || 0);

    return sum + quantity * price;
  }, 0);

  const lowStockCount = products.filter((product) => {
    const quantity = Number(product.stock_quantity || 0);
    return quantity > 0 && quantity <= 10;
  }).length;

  const outOfStockCount = products.filter(
    (product) => Number(product.stock_quantity || 0) === 0
  ).length;

  const stockOverviewData = [
    {
      name: 'In Stock',
      value: products.filter(
        (product) => Number(product.stock_quantity || 0) > 10
      ).length,
    },
    {
      name: 'Low Stock',
      value: lowStockCount,
    },
    {
      name: 'Out of Stock',
      value: outOfStockCount,
    },
  ];

  const topStockProducts = [...products]
    .sort(
      (a, b) =>
        Number(b.stock_quantity || 0) - Number(a.stock_quantity || 0)
    )
    .slice(0, 8)
    .map((product) => ({
      name:
        product.name.length > 12
          ? `${product.name.slice(0, 12)}...`
          : product.name,
      stock: Number(product.stock_quantity || 0),
    }));

  const inventoryValueData = [...products]
    .sort((a, b) => {
      const aValue =
        Number(a.stock_quantity || 0) * Number(a.selling_price || 0);
      const bValue =
        Number(b.stock_quantity || 0) * Number(b.selling_price || 0);

      return bValue - aValue;
    })
    .slice(0, 6)
    .map((product) => ({
      name:
        product.name.length > 10
          ? `${product.name.slice(0, 10)}...`
          : product.name,
      value:
        Number(product.stock_quantity || 0) *
        Number(product.selling_price || 0),
    }));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Inventory Reports
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Monitor stock levels, inventory value, and product performance.
            </p>
          </div>

          <button
            onClick={loadProducts}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Refresh Data
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Products
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {totalProducts}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Stock
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {totalStock}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Inventory Value
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              ₱{totalInventoryValue.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Low Stock Items
            </p>
            <h2 className="mt-2 text-3xl font-bold text-red-500">
              {lowStockCount}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Stock Overview
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Distribution of inventory status.
                </p>
              </div>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={300}
                >
                <PieChart>
                  <Pie
                    data={stockOverviewData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {stockOverviewData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Top Stocked Products
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Products with the highest quantity in stock.
              </p>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={300}
                >
                <BarChart data={topStockProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="stock" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Highest Inventory Value
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Products contributing the most to your inventory value.
            </p>
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={300}
                >
              <LineChart data={inventoryValueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Inventory List
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Search and filter your product inventory.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />

              <select
                value={stockFilter}
                onChange={(e) =>
                  setStockFilter(
                    e.target.value as 'all' | 'low' | 'out'
                  )
                }
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="all">All Products</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Product
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Category
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Price
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Stock
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Inventory Value
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      Loading inventory data...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const quantity = Number(product.stock_quantity || 0);
                    const price = Number(product.selling_price || 0);
                    const inventoryValue = quantity * price;

                    return (
                      <tr
                        key={product.id}
                        className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {product.category || 'N/A'}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                          ₱{price.toLocaleString()}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {quantity}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                          ₱{inventoryValue.toLocaleString()}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm">
                          {quantity === 0 ? (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
                              Out of Stock
                            </span>
                          ) : quantity <= 10 ? (
                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
                              Low Stock
                            </span>
                          ) : (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400">
                              In Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}