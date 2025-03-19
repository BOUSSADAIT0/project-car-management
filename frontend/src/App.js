import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MyRequestsPage from './pages/MyRequestsPage';
import VehicleListPage from './pages/admin/VehicleListPage';
import VehicleEditPage from './pages/admin/VehicleEditPage';
import RequestListPage from './pages/admin/RequestListPage';
import UserListPage from './pages/admin/UserListPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search/:keyword" element={<HomePage />} />
            <Route path="/page/:pageNumber" element={<HomePage />} />
            <Route path="/search/:keyword/page/:pageNumber" element={<HomePage />} />
            <Route path="/vehicle/:id" element={<VehicleDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-requests" 
              element={
                <ProtectedRoute>
                  <MyRequestsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/vehicles" 
              element={
                <AdminRoute>
                  <VehicleListPage />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/vehicles/:pageNumber" 
              element={
                <AdminRoute>
                  <VehicleListPage />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/vehicle/:id/edit" 
              element={
                <AdminRoute>
                  <VehicleEditPage />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/vehicle/new" 
              element={
                <AdminRoute>
                  <VehicleEditPage />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/requests" 
              element={
                <AdminRoute>
                  <RequestListPage />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <AdminRoute>
                  <UserListPage />
                </AdminRoute>
              } 
            />
          </Routes>
        </Container>
      </main>
      <Footer />
    </>
  );
}

export default App;