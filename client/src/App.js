import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TicketProvider } from './context/TicketContext';
import ProtectedRoute from './routes/ProtectedRoute';
import ChatModal from './components/ChatModal';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import MyTickets from './pages/employee/MyTickets';
import TicketDetail from './pages/employee/TicketDetail';

import AdminDashboard from './pages/admin/AdminDashboard';
import AllTickets from './pages/admin/AllTickets';
import CreateTicket from './pages/admin/CreateTicket';
import Performance from './pages/admin/Performance';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TicketProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />

            {/* Role-based redirect */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Employee routes */}
            <Route path="/employee/dashboard" element={
              <ProtectedRoute role="EMPLOYEE"><EmployeeDashboard /></ProtectedRoute>
            } />
            <Route path="/employee/tickets" element={
              <ProtectedRoute role="EMPLOYEE"><MyTickets /></ProtectedRoute>
            } />
            <Route path="/employee/tickets/:id" element={
              <ProtectedRoute role="EMPLOYEE"><TicketDetail /></ProtectedRoute>
            } />

            {/* Admin routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/tickets" element={
              <ProtectedRoute role="ADMIN"><AllTickets /></ProtectedRoute>
            } />
            <Route path="/admin/create-ticket" element={
              <ProtectedRoute role="ADMIN"><CreateTicket /></ProtectedRoute>
            } />
            <Route path="/admin/performance" element={
              <ProtectedRoute role="ADMIN"><Performance /></ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </TicketProvider>
        {/* Global AI chat — only shown when signed in */}
        <ChatModal />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
