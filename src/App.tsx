import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import MyScholarships from './pages/student/MyScholarships';
import Applications from './pages/student/Applications';
import AdminDashboard from './pages/admin/Dashboard';
import AdminAccess from './pages/admin/AdminAccess';

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole?: 'student' | 'admin' }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  // Admins have master control, they can view any page
  if (allowedRole === 'student' && user.role !== 'student' && user.role !== 'admin') {
    return <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} replace />;
  }
  
  // If route is admin only, restrict students
  if (allowedRole === 'admin' && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-access" element={<AdminAccess />} />
            
            <Route element={<MainLayout />}>
              {/* Student Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute allowedRole="student">
                  <StudentProfile />
                </ProtectedRoute>
              } />
              <Route path="/my-scholarships" element={
                <ProtectedRoute allowedRole="student">
                  <MyScholarships />
                </ProtectedRoute>
              } />
              <Route path="/applications" element={
                <ProtectedRoute allowedRole="student">
                  <Applications />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}
