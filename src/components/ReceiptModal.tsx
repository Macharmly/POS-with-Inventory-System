import { X, Printer } from 'lucide-react';

interface ReceiptModalProps {

  receipt: any;

  onClose: () => void;

}

export default function ReceiptModal({

  receipt,
  onClose

}: ReceiptModalProps) {

  if (!receipt) return null;

  const handlePrint = () => {

    window.print();

  };

  return (

    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/50
        backdrop-blur-sm
        p-4
      "
    >

      <div
        className="
          w-full
          max-w-md
          h-auto
          max-h-[90vh]
          bg-white
          dark:bg-zinc-900
          rounded-3xl
          shadow-2xl
          overflow-hidden
          flex
          flex-col
        "
      >

        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between
            px-6
            py-5
            border-b
            border-zinc-200
            dark:border-zinc-800
          "
        >

          <div>

            <h2
              className="
                text-xl
                font-semibold
              "
            >
              Receipt
            </h2>

            <p
              className="
                text-sm
                text-zinc-500
                dark:text-zinc-400
                mt-1
              "
            >
              Transaction completed
            </p>

          </div>

          <button
            onClick={onClose}
            className="
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

        {/* Receipt Content */}

        <div
          id="receipt-print"
          className="
            px-4
            sm:px-6
            py-4
            sm:py-6
            space-y-6
            overflow-y-auto
            flex-1
          "
        >

          {/* Store */}

            <div className="text-center">

            <h1
                className="
                text-2xl
                font-bold
                "
            >
                {receipt.businessName}
            </h1>

            <p
                className="
                text-sm
                text-zinc-500
                dark:text-zinc-400
                mt-1
                "
            >
                Official Receipt
            </p>

            </div>

          {/* Details */}

          <div
            className="
              space-y-2
              text-sm
            "
          >

            <div className="flex justify-between">

              <span className="text-zinc-500">
                Invoice
              </span>

              <span className="font-medium">
                {receipt.invoiceNumber}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-zinc-500">
                Payment
              </span>

              <span className="font-medium">
                {receipt.paymentMethod}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-zinc-500">
                Date
              </span>

              <span className="font-medium">

                {new Date(
                  receipt.createdAt
                ).toLocaleString()}

              </span>

            </div>

          </div>

          {/* Items */}

          <div
            className="
              border-t
              border-b
              border-zinc-200
              dark:border-zinc-800
              py-4
              space-y-4
              max-h-[30vh]
              overflow-y-auto
            "
          >

            {receipt.items.map(
              (
                item: any,
                index: number
              ) => (

                <div
                  key={`${item.name}-${index}`}
                  className="
                    flex
                    justify-between
                    gap-4
                  "
                >

                  <div>

                    <p className="font-medium">
                      {item.name}

                      {item.item_type === 'service' && (
                        <span className="
                          ml-2
                          text-xs
                          text-blue-500
                        ">
                          (Service)
                        </span>
                      )}
                    </p>

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

                  <span
                    className="
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

              )
            )}

          </div>

          {/* Totals */}

          <div className="space-y-3">

            {/* Subtotal */}

            <div
              className="
                flex
                justify-between
                items-center
              "
            >

              <span
                className="
                  text-zinc-500
                "
              >
                Subtotal
              </span>

              <span className="font-medium">

                ₱
                {(
                  receipt.items.reduce(
                    (
                      sum: number,
                      item: any
                    ) =>

                      sum +

                      (
                        Number(

                          item.item_type === 'service'

                            ? item.service_price

                            : item.selling_price

                        ) *

                        item.quantity
                      ),

                    0
                  )
                ).toFixed(2)}

              </span>

            </div>

            {/* Discount */}

            {receipt.discountAmount > 0 && (

              <div
                className="
                  flex
                  justify-between
                  items-center
                "
              >

                <span
                  className="
                    text-zinc-500
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
                  {Number(
                    receipt.discountAmount
                  ).toFixed(2)}

                </span>

              </div>

            )}

            {/* Final Total */}

            <div
              className="
                flex
                justify-between
                items-center
                pt-3
                border-t
                border-zinc-200
                dark:border-zinc-800
              "
            >

              <span
                className="
                  text-lg
                  font-medium
                "
              >
                Total
              </span>

              <span
                className="
                  text-2xl
                  font-bold
                "
              >

                ₱
                {Number(
                  receipt.totalAmount
                ).toFixed(2)}

              </span>

            </div>

            {/* Cash Received */}

            {receipt.paymentMethod === 'cash' && (

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
                    text-zinc-500
                  "
                >
                  Cash Received
                </span>

                <span className="font-medium">

                  ₱
                  {Number(
                    receipt.cashReceived || 0
                  ).toFixed(2)}

                </span>

              </div>

            )}

            {/* Change */}

            {receipt.paymentMethod === 'cash' && (

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
                    text-zinc-500
                  "
                >
                  Change
                </span>

                <span
                  className="
                    font-semibold
                    text-emerald-500
                  "
                >

                  ₱
                  {Number(
                    receipt.change || 0
                  ).toFixed(2)}

                </span>

              </div>

            )}

          </div>

        </div>

        {/* Footer */}

        <div
          className="
            flex
            gap-3
            px-6
            py-5
            border-t
            border-zinc-200
            dark:border-zinc-800
          "
        >

          <button
            onClick={handlePrint}
            className="
              flex-1
              flex
              items-center
              justify-center
              gap-2
              bg-zinc-900
              dark:bg-zinc-100
              text-white
              dark:text-zinc-900
              py-3
              rounded-xl
              text-sm
              font-medium
              transition
              hover:opacity-90
            "
          >

            <Printer size={18} />

            Print Receipt

          </button>

          <button
            onClick={onClose}
            className="
              flex-1
              border
              border-zinc-200
              dark:border-zinc-800
              py-3
              rounded-xl
              text-sm
              font-medium
              hover:bg-zinc-100
              dark:hover:bg-zinc-800
              transition
            "
          >
            Close
          </button>

        </div>

      </div>

    </div>

  );

}