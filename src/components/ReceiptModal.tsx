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

  const getItemPrice = (item: any) => {
    return Number(
      item.item_type === 'service'
        ? item.service_price
        : item.selling_price
    ) || 0;
  };

  const subtotal = receipt.items.reduce(
    (sum: number, item: any) =>
      sum + getItemPrice(item) * item.quantity,
    0
  );

  const handlePrint = (
    type: 'digital' | 'thermal'
  ) => {

    const printWindow = window.open(
      '',
      '_blank',
      'width=400,height=600'
    );

    if (!printWindow) return;

    const isThermal =
      type === 'thermal';

    const receiptHtml =
      document.getElementById(
        'receipt-print'
      )?.innerHTML;

    if (!receiptHtml) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt</title>

          <style>
            @page {
              margin: 0;
            }

            body {
              margin: 0;
              padding: ${isThermal ? '8px' : '20px'};
              background: white;
              color: black;
              font-family: ${isThermal ? '"Courier New", monospace' : 'Arial, sans-serif'};
              font-size: ${isThermal ? '11px' : '14px'};
              line-height: ${isThermal ? '1.35' : '1.6'};
            }

            .receipt {
              width: ${isThermal ? '80mm' : '170mm'};
              margin: 0 auto;
            }

            * {
              box-sizing: border-box;
              color: black !important;
            }

            h1 {
              text-align: center;
              font-size: ${isThermal ? '15px' : '26px'};
              margin: 0;
              letter-spacing: ${isThermal ? '1px' : '0'};
              text-transform: uppercase;
            }

            p {
              margin: 0;
            }

            .flex {
              display: flex;
            }

            .justify-between {
              justify-content: space-between;
            }

            .items-center {
              align-items: center;
            }

            .gap-4 {
              gap: 16px;
            }

            .text-center {
              text-align: center;
            }

            .text-right {
              text-align: right;
            }

            .font-medium {
              font-weight: 500;
            }

            .font-semibold {
              font-weight: 600;
            }

            .font-bold {
              font-weight: 700;
            }

            .receipt-header {
              text-align: center;
              margin-bottom: 10px;
            }

            .receipt-header h1 {
              font-size: ${isThermal ? '15px' : '24px'};
              font-weight: 700;
              margin: 0;
              letter-spacing: ${isThermal ? '0.5px' : '0'};
              text-transform: uppercase;
            }

            .receipt-business-details {
              margin-top: 4px;
            }

            .receipt-business-details p {
              font-size: ${isThermal ? '9px' : '11px'};
              line-height: 1.25;
              margin: 1px 0;
              font-weight: 400;
              text-transform: none;
            }

            .receipt-title {
              margin-top: 6px;
              font-size: ${isThermal ? '10px' : '12px'};
              font-weight: 600;
              text-transform: uppercase;
            }

            .shrink-0 {
              flex-shrink: 0;
            }

            .capitalize {
              text-transform: capitalize;
            }

            .receipt-section {
              border-top: 1px dashed #000;
              margin-top: ${isThermal ? '10px' : '16px'};
              padding-top: ${isThermal ? '10px' : '16px'};
            }

            .receipt-items {
              border-bottom: 1px dashed #000;
              padding-bottom: ${isThermal ? '10px' : '16px'};
            }

            .receipt-items > div {
              padding: ${isThermal ? '6px 0' : '10px 0'};
            }

            .receipt-total {
              border-top: 1px dashed #000;
              margin-top: ${isThermal ? '10px' : '14px'};
              padding-top: ${isThermal ? '10px' : '14px'};
              font-size: ${isThermal ? '14px' : '18px'};
              letter-spacing: ${isThermal ? '1px' : '0'};
            }

            .receipt-footer {
              text-align: center;
              border-top: 1px dashed #000;
              margin-top: ${isThermal ? '14px' : '18px'};
              padding-top: ${isThermal ? '12px' : '16px'};
            }

            .receipt-footer p:first-child {
              font-weight: 700;
            }

            .ml-1 {
              margin-left: 4px;
            }

            .mt-1 {
              margin-top: 4px;
            }

            .pt-2 {
              padding-top: 8px;
            }
          </style>
        </head>

        <body>
          <div class="receipt">
            ${receiptHtml}
          </div>

          <script>
            window.onload = function () {
              window.print();

              window.onafterprint = function () {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();

  };

  const ReceiptContent = ({
    printMode = false
  }: {
    printMode?: boolean;
  }) => {
    return (
      <>
        {/* Store */}

        <div
          className={
            printMode
              ? 'receipt-header'
              : 'text-center'
          }
        >
          <h1
            className={
              printMode
                ? 'font-bold text-center'
                : 'text-2xl font-bold'
            }
          >
            {receipt.businessName}
          </h1>

          <div
            className={
              printMode
                ? 'receipt-business-details'
                : 'text-sm text-zinc-500 dark:text-zinc-400 mt-1 space-y-1'
            }
          >
            {receipt.businessAddress && (
              <p>{receipt.businessAddress}</p>
            )}

            {receipt.businessContactNumber && (
              <p>
                Contact: {receipt.businessContactNumber}
              </p>
            )}

            {receipt.businessEmail && (
              <p>
                Email: {receipt.businessEmail}
              </p>
            )}

            {receipt.businessTinNumber && (
              <p>
                TIN: {receipt.businessTinNumber}
              </p>
            )}

            {receipt.businessTaxType && (
              <p>
                {receipt.businessTaxType}
              </p>
            )}
          </div>

          <p
            className={
              printMode
                ? 'receipt-title'
                : 'text-sm text-zinc-500 dark:text-zinc-400 mt-2'
            }
          >
            Official Receipt
          </p>
        </div>

        {/* Details */}

        <div className={printMode ? 'receipt-section' : 'space-y-2 text-sm'}>
          <div className="flex justify-between">
            <span className={printMode ? '' : 'text-zinc-500'}>
              Invoice
            </span>

            <span className="font-medium">
              {receipt.invoiceNumber}
            </span>
          </div>

          <div className="flex justify-between">
            <span className={printMode ? '' : 'text-zinc-500'}>
              Payment
            </span>

            <span className="font-medium capitalize">
              {receipt.paymentMethod}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className={printMode ? '' : 'text-zinc-500'}>
              Date
            </span>

            <span className="font-medium text-right">
              {new Date(receipt.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Items */}

        <div
          className={
            printMode
              ? 'receipt-section receipt-items'
              : 'border-t border-b border-zinc-200 dark:border-zinc-800 py-4 space-y-4 max-h-[30vh] overflow-y-auto'
          }
        >
          {receipt.items.map((item: any, index: number) => (
            <div
              key={`${item.name}-${index}`}
              className="flex justify-between gap-4"
            >
              <div>
                <p className="font-medium">
                  {item.name}

                  {item.item_type === 'service' && (
                    <span
                      className={
                        printMode
                          ? 'ml-1'
                          : 'ml-2 text-xs text-blue-500'
                      }
                    >
                      (Service)
                    </span>
                  )}
                </p>

                <p
                  className={
                    printMode
                      ? 'mt-1'
                      : 'text-sm text-zinc-500 dark:text-zinc-400 mt-1'
                  }
                >
                  ₱{getItemPrice(item).toFixed(2)} × {item.quantity}
                </p>
              </div>

              <span className="font-semibold shrink-0">
                ₱{(getItemPrice(item) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}

        <div className={printMode ? 'receipt-section' : 'space-y-3'}>
          <div className="flex justify-between items-center">
            <span className={printMode ? '' : 'text-zinc-500'}>
              Subtotal
            </span>

            <span className="font-medium">
              ₱{subtotal.toFixed(2)}
            </span>
          </div>

          {receipt.discountAmount > 0 && (
            <div className="flex justify-between items-center">
              <span className={printMode ? '' : 'text-zinc-500'}>
                Discount
              </span>

              <span className={printMode ? 'font-medium' : 'font-medium text-red-500'}>
                - ₱{Number(receipt.discountAmount).toFixed(2)}
              </span>
            </div>
          )}

          <div
            className={
              printMode
                ? 'flex justify-between items-center receipt-total'
                : 'flex justify-between items-center pt-3 border-t border-zinc-200 dark:border-zinc-800'
            }
          >
            <span className={printMode ? 'font-bold' : 'text-lg font-medium'}>
              Total
            </span>

            <span className={printMode ? 'font-bold' : 'text-2xl font-bold'}>
              ₱{Number(receipt.totalAmount).toFixed(2)}
            </span>
          </div>

          {receipt.paymentMethod === 'cash' && (
            <>
              <div className="flex justify-between items-center pt-2">
                <span className={printMode ? '' : 'text-zinc-500'}>
                  Cash Received
                </span>

                <span className="font-medium">
                  ₱{Number(receipt.cashReceived || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className={printMode ? '' : 'text-zinc-500'}>
                  Change
                </span>

                <span
                  className={
                    printMode
                      ? 'font-semibold'
                      : 'font-semibold text-emerald-500'
                  }
                >
                  ₱{Number(receipt.change || 0).toFixed(2)}
                </span>
              </div>
            </>
          )}
        </div>

        {printMode && (
          <div className="receipt-footer">
            {receipt.receiptFooter ? (
              <p>{receipt.receiptFooter}</p>
            ) : (
              <>
                <p>Thank you!</p>
                <p>Please come again.</p>
              </>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <>
      {/* Screen Modal */}

      <div
        className="
          no-print
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
              <h2 className="text-xl font-semibold">
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
            <ReceiptContent />
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
              onClick={() => handlePrint('digital')}
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
              Digital Print
            </button>

            <button
              onClick={() => handlePrint('thermal')}
              className="
                flex-1
                flex
                items-center
                justify-center
                gap-2
                bg-emerald-600
                text-white
                py-3
                rounded-xl
                text-sm
                font-medium
                transition
                hover:opacity-90
              "
            >
              <Printer size={18} />
              Thermal Print
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

      {/* Print-only Receipt */}

      <div
        id="receipt-print"
        className="print-only"
      >
        <ReceiptContent printMode />
      </div>
    </>
  );
}
