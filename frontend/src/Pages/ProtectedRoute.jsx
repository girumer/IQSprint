// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        🔄 Checking authentication...
      </div>
    );
  }

  // If no user after loading, redirect to login
  if (!user) {
    console.log("🔎 ProtectedRoute: No user, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Role-based access control
  if (role && user.role !== role) {
    console.log(`🔎 ProtectedRoute: User role ${user.role} doesn't match required role ${role}`);
    return <Navigate to="/login" replace />;
  }

  console.log("✅ ProtectedRoute: Access granted");
  return children;
}

export default ProtectedRoute;