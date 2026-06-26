import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import POSPage from './pages/POSPage';
import InventoryPage from './pages/InventoryPage';
import InventoryReportPage from './pages/InventoryReportPage';
import SaleDetailsPage from './pages/SaleDetailsPage';
import SalesHistoryPage from './pages/SalesHistoryPage';
import RestockPage from './pages/RestockPage';
import InventoryAdjustmentPage from './pages/InventoryAdjustmentPage';
import ServicesPage from './pages/ServicesPage';
import ReportsPage from './pages/ReportsPage';
import SalesReportPage from './pages/SalesReportPage';
import UserManagementPage from './pages/UserManagementPage';
import LogsPage from './pages/LogsPage';
import FinancePage from './pages/FinancePage';
import LowStockReportPage from './pages/LowStockReportPage';
import ProfitReportPage from './pages/ProfitReportPage';
import ServiceReportPage from './pages/ServiceReportPage';
import ProductPerformanceReportPage from './pages/ProductPerformanceReportPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import StoreSettingsPage from './pages/StoreSettingsPage';

import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pos" element={<POSPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/inventory-reports" element={<InventoryReportPage />} />
          <Route path="/sales-history" element={<SalesHistoryPage />} />
          <Route path="/sales/:id" element={<SaleDetailsPage />} />
          <Route path="/restock" element={<RestockPage />} />
          <Route path="/inventory-adjustment" element={<InventoryAdjustmentPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/sales" element={<SalesReportPage />} />
          <Route path="/reports/services" element={<ServiceReportPage />} />
          <Route path="/reports/low-stock" element={<LowStockReportPage />} />
          <Route path="/reports/profit" element={<ProfitReportPage />} />
          <Route path="/reports/product-performance" element={<ProductPerformanceReportPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route element={<RoleProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/users" element={<UserManagementPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/store-settings" element={<StoreSettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}