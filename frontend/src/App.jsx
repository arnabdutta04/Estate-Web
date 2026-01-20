// App.jsx
import React from "react";
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import Welcome from "./pages/Welcome";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Explore from "./pages/Explore";
import Brokers from "./pages/Brokers";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {/* Render Welcome page in background when on auth pages */}
      {isAuthPage && <Welcome />}
      
      <Routes>
        {/* WELCOME = HOME */}
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        
        {/* PUBLIC ROUTES - No login required */}
        <Route path="/explore" element={<Explore />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        
        {/* Property Preview - redirects to property detail */}
        <Route path="/property-preview/:id" element={<PropertyDetail />} />

        {/* PROTECTED ROUTES - Login required */}
        <Route
          path="/brokers"
          element={
            <ProtectedRoute>
              <Brokers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* AUTH ROUTES - Render as modals over Welcome page */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 404 - Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}