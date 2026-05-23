import axios from 'axios';

const API_URL =
  'http://localhost:5000/api';

/* =========================
   CHECKOUT
========================= */

export const checkoutSale = async (
  saleData: any
) => {

  const response =
    await axios.post(

      `${API_URL}/checkout`,

      saleData

    );

  return response.data;

};

/* =========================
   SALES HISTORY
========================= */

export const fetchSalesHistory = async (
  business_id: number
) => {

  const response =
    await axios.get(

      `${API_URL}/sales-history`,

      {
        params: {
          business_id
        }
      }

    );

  return response.data;

};

/* =========================
   SALE DETAILS
========================= */

export const fetchSaleDetails = async (
  saleId: number
) => {

  const response =
    await axios.get(
      `${API_URL}/sales/${saleId}`
    );

  return response.data;

};

/* =========================
   DASHBOARD ANALYTICS
========================= */

export const fetchDashboardAnalytics = async (
  business_id: number
) => {

  const response =
    await axios.get(

      `${API_URL}/dashboard-analytics`,

      {
        params: {
          business_id
        }
      }

    );

  return response.data;

};

/* =========================
   LOW STOCK PRODUCTS
========================= */

export const fetchLowStockProducts = async (
  business_id: number
) => {

  const response =
    await axios.get(

      `${API_URL}/low-stock`,

      {
        params: {
          business_id
        }
      }

    );

  return response.data;

};

/* =========================
   RESTOCK PRODUCT
========================= */

export const restockProduct = async (
  restockData: any
) => {

  const response =
    await axios.post(

      `${API_URL}/restock`,

      restockData

    );

  return response.data;

};

/* =========================
   ADJUST INVENTORY
========================= */

export const adjustInventory = async (
  adjustmentData: any
) => {

  const response =
    await axios.post(

      `${API_URL}/adjust-inventory`,

      adjustmentData

    );

  return response.data;

};

/* =========================
   SERVICES
========================= */

export const fetchServices = async (
  business_id: number
) => {

  const response =
    await axios.get(

      `${API_URL}/services`,

      {
        params: {
          business_id
        }
      }

    );

  return response.data;

};

/* =========================
   SALES REPORT
========================= */

export const fetchSalesReport = async (

  startDate: string,

  endDate: string,

  business_id: number

) => {

  const response =
    await axios.get(

      `${API_URL}/reports/sales`,

      {
        params: {

          startDate,
          endDate,
          business_id

        }
      }

    );

  return response.data;

};