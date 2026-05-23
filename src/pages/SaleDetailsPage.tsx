import { useEffect, useState } from 'react';

import {
  useNavigate,
  useParams
} from 'react-router-dom';

import {
  fetchSaleDetails
} from '../services/salesService';

interface SaleItem {
  name: string;
  quantity: number;
  price_at_sale: number;
}

interface SaleData {
  id: number;
  invoice_number: string;
  total_amount: number;
  payment_method: string;
  cashier_name: string;
  created_at: string;
}

export default function SaleDetailsPage() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [sale, setSale] = useState<SaleData | null>(null);

  const [items, setItems] = useState<SaleItem[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadSaleDetails = async () => {

      try {

        const data = await fetchSaleDetails(
          Number(id)
        );

        setSale(data.sale);

        setItems(data.items);

      } catch (error) {

        console.error(
          'Failed to load sale details',
          error
        );

      } finally {

        setLoading(false);

      }
    };

    loadSaleDetails();

  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        Loading receipt details...
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="p-6">
        Sale not found.
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @media print {

            body {
              background: white;
            }

            button {
              display: none;
            }

            .print-container {
              box-shadow: none !important;
              border: none !important;
            }

          }
        `}
      </style>

      <div className="min-h-screen bg-gray-100 p-6">

        <div className="print-container max-w-4xl mx-auto bg-white rounded-xl shadow border p-6">

          <div className="flex justify-between items-center mb-6">

            <div>

              <h1 className="text-3xl font-black text-gray-800">
                Receipt Details
              </h1>

              <p className="text-gray-500 mt-1">
                Invoice:
                {' '}
                {sale.invoice_number}
              </p>

            </div>

            <div className="flex gap-2">

              <button
                onClick={() => window.print()}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Print Receipt
              </button>

              <button
                onClick={() => navigate('/sales-history')}
                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
              >
                Back
              </button>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

            <div className="border rounded-lg p-4">

              <p className="text-sm text-gray-500">
                Cashier
              </p>

              <p className="font-bold">
                {sale.cashier_name}
              </p>

            </div>

            <div className="border rounded-lg p-4">

              <p className="text-sm text-gray-500">
                Payment Method
              </p>

              <p className="font-bold capitalize">
                {sale.payment_method}
              </p>

            </div>

            <div className="border rounded-lg p-4">

              <p className="text-sm text-gray-500">
                Date
              </p>

              <p className="font-bold">
                {new Date(
                  sale.created_at
                ).toLocaleString()}
              </p>

            </div>

            <div className="border rounded-lg p-4">

              <p className="text-sm text-gray-500">
                Total Amount
              </p>

              <p className="font-bold text-green-600">
                ₱
                {Number(
                  sale.total_amount
                ).toFixed(2)}
              </p>

            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="min-w-full border border-gray-300">

              <thead className="bg-gray-100">

                <tr>

                  <th className="border p-3 text-left">
                    Product
                  </th>

                  <th className="border p-3 text-left">
                    Quantity
                  </th>

                  <th className="border p-3 text-left">
                    Price
                  </th>

                  <th className="border p-3 text-left">
                    Subtotal
                  </th>

                </tr>

              </thead>

              <tbody>

                {items.map((item, index) => (

                  <tr key={index}>

                    <td className="border p-3">
                      {item.name}
                    </td>

                    <td className="border p-3">
                      {item.quantity}
                    </td>

                    <td className="border p-3">
                      ₱
                      {Number(
                        item.price_at_sale
                      ).toFixed(2)}
                    </td>

                    <td className="border p-3">

                      ₱
                      {(
                        item.quantity *
                        item.price_at_sale
                      ).toFixed(2)}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </>
  );
}