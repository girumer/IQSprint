// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import GameTabs from './Pages/GameTabs';
import AdminDashboard from './Pages/AdminDashboard';
import ProtectedRoute from './Pages/ProtectedRoute'; // Temporary
import { AuthProvider } from './contexts/AuthContext';
function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Temporary - remove after debugging */}
        <Routes>
          <Route path="/login" element={<Login />} />
           <Route path="/signup" element={<Signup />} />
          <Route 
            path="/GameTabs" 
            element={
              <ProtectedRoute>
                <GameTabs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/GameTabs" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;