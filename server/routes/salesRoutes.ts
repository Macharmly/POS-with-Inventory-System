import express from 'express';

import {
  checkout,
  getSalesHistory,
  getSaleDetails,
  getDashboardAnalytics,
  getLowStockProducts,
  restockProduct,
  adjustInventory,
  getServices,
  createService,
  updateService,
  deleteService,
  getSalesReport,
  getProfitReport,
  getServiceProducts,
  addServiceProduct,
  removeServiceProduct,
  getServiceReport
} from '../controllers/salesController';

const router = express.Router();

router.post('/checkout', checkout);

router.get(
  '/sales-history',
  getSalesHistory
);

router.get(
  '/sales/:id',
  getSaleDetails
);

router.get(
  '/dashboard-analytics',
  getDashboardAnalytics
);

router.get(
  '/low-stock',
  getLowStockProducts
);

router.post(
  '/restock',
  restockProduct
);

router.post(
  '/adjust-inventory',
  adjustInventory
);

router.get(
  '/services',
  getServices
);

router.post(
  '/services',
  createService
);

router.put(
  '/services/:id',
  updateService
);

router.delete(
  '/services/:id',
  deleteService
);

router.get(
  '/services/:id/products',
  getServiceProducts
);

router.post(
  '/services/:id/products',
  addServiceProduct
);

router.delete(
  '/services/:serviceId/products/:productId',
  removeServiceProduct
);

router.get(
  '/reports/sales',
  getSalesReport
);

router.get(
  '/reports/profit/:business_id',
  getProfitReport
);

router.get(
  '/reports/services',
  getServiceReport
);

export default router;