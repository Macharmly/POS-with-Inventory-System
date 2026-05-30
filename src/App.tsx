import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

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
import RoleProtectedRoute from './components/RoleProtectedRoute';
import ProfilePage from './pages/ProfilePage';

import ProtectedRoute from './components/ProtectedRoute';

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Public Route */}

        <Route
          path="/"
          element={<LoginPage />}
        />

        {/* Protected Routes */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pos"
          element={
            <ProtectedRoute>
              <POSPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <InventoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory-reports"
          element={
            <ProtectedRoute>
              <InventoryReportPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales-history"
          element={
            <ProtectedRoute>
              <SalesHistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales/:id"
          element={
            <ProtectedRoute>
              <SaleDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/restock"
          element={
            <ProtectedRoute>
              <RestockPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory-adjustment"
          element={
            <ProtectedRoute>
              <InventoryAdjustmentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/finance"
          element={
            <ProtectedRoute>
              <FinancePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/low-stock"
          element={
            <ProtectedRoute>
              <LowStockReportPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/profit"
          element={
            <ProtectedRoute>
              <ProfitReportPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/product-performance"
          element={
            <ProtectedRoute>
              <ProductPerformanceReportPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <ServicesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/sales"
          element={
            <ProtectedRoute>
              <SalesReportPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/services"
          element={
            <ProtectedRoute>
              <ServiceReportPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>

              <RoleProtectedRoute
                allowedRoles={[
                  'admin'
                ]}
              >
                <UserManagementPage />
              </RoleProtectedRoute>

            </ProtectedRoute>
          }
        />

        <Route
          path="/logs"
          element={
            <ProtectedRoute>

              <RoleProtectedRoute
                allowedRoles={[
                  'admin'
                ]}
              >
                <LogsPage />
              </RoleProtectedRoute>

            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );
}