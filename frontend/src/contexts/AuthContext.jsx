// contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const phoneNumber = localStorage.getItem('phoneNumber');
      const role = localStorage.getItem('role');

      console.log("🔎 AuthContext: checkAuth start", { 
        hasToken: !!token, 
        hasUserId: !!userId,
        phoneNumber 
      });

      if (!token || !userId) {
        console.log("🔎 AuthContext: No token or userId found");
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // 1. Check token expiration locally
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        
        if (decoded.exp && decoded.exp < now) {
          console.warn("⚠️ AuthContext: Token expired");
          logout();
          setLoading(false);
          return;
        }

        // 2. Try backend verification (optional but recommended)
        try {
          const res = await axios.get(`${process.env.REACT_APP_BACKENDURL}/api/verify-token`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000 // 5 second timeout
          });
          console.log("✅ AuthContext: Backend verification successful");
        } catch (error) {
          if (error.response?.status === 401) {
            console.error("❌ AuthContext: Backend rejected token");
            logout();
            setLoading(false);
            return;
          }
          // If it's a network error or endpoint doesn't exist, continue with local auth
          console.warn("⚠️ AuthContext: Backend verification failed, using local auth", error.message);
        }

        // 3. Set user from localStorage
        setUser({ 
          _id: userId, 
          phoneNumber, 
          role, 
          token 
        });
        console.log("✅ AuthContext: User authenticated successfully");

      } catch (err) {
        console.error("❌ AuthContext: Token decode failed", err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    console.log("🔎 AuthContext: login called", { userData, token });
    
    localStorage.setItem('userId', userData._id);
    localStorage.setItem('phoneNumber', userData.phoneNumber);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('token', token);

    setUser({ ...userData, token });
  };

  const logout = () => {
    console.log("🔎 AuthContext: logout called");
    localStorage.removeItem('userId');
    localStorage.removeItem('phoneNumber');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};