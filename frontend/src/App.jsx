// App.jsx - CORRECTED VERSION
import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

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
  return (
    <Routes>
      {/* HOME/WELCOME PAGE */}
      <Route path="/" element={<Welcome />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      
      {/* PUBLIC ROUTES - No login required */}
      <Route path="/properties" element={<Properties />} />
      <Route path="/properties/:id" element={<PropertyDetail />} />
      <Route path="/explore" element={<Explore />} />

      {/* AUTH ROUTES - Render as modals over Welcome page */}
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

      {/* 404 FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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