import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'sonner';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import InventoryPage from './pages/dashboard/InventoryPage';
import OrdersPage from './pages/dashboard/OrdersPage';
import StaffManagement from './pages/dashboard/StaffManagement';
import CustomerOrders from './pages/CustomerOrders';

const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return <>{children}</>;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'customer' ? '/' : '/dashboard'} /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to="/" /> : <SignupPage />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      
      {/* Customer Routes */}
      <Route path="/cart" element={<CartPage />} />
      <Route path="/my-orders" element={
        <ProtectedRoute roles={['customer']}>
          <CustomerOrders />
        </ProtectedRoute>
      } />

      {/* Dashboard Routes (Admin & Staff) */}
      <Route path="/dashboard" element={
        <ProtectedRoute roles={['admin', 'staff']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="staff" element={
          <ProtectedRoute roles={['admin']}>
            <StaffManagement />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;