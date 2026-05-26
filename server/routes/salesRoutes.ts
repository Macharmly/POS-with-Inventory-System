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
  getSalesReport,
  getProfitReport
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

router.get(
  '/reports/sales',
  getSalesReport
);

router.get(
  '/reports/profit/:business_id',
  getProfitReport
);

export default router;