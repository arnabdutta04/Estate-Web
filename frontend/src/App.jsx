// App.jsx
import React from "react";
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Welcome from "./pages/Welcome";
import Properties from "./pages/Properties";
import PropertyDetail from "../components/PropertyDetail";
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
        
        {/* PUBLIC ROUTE - No login required to view properties */}
        <Route path="/properties" element={<Properties />} />

        {/* PUBLIC ROUTE - No login required to view property details */}
        <Route path="/properties/:id" element={<PropertyDetail />} />

        {/* PUBLIC ROUTE - Explore page with market insights */}
        <Route path="/explore" element={<Explore />} />

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

        {/* AUTH - Render as modals over Welcome page */}
        <Route path="/" element={<Welcome />} />
  <Route path="/login" element={
    <>
      <Welcome />
      <Login />
    </>
  } />
        <Route path="/register" element={
    <>
      <Welcome />
      <Register />
    </>
  } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
  );
}