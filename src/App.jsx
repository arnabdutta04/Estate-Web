// App.jsx - CORRECTED VERSION WITH PROFILE ROUTE
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Pages
import Welcome from "./pages/Welcome";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Explore from "./pages/Explore";
import Brokers from "./pages/Brokers";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

// Components
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
      <Route path="/property/:id" element={<PropertyDetail />} />
      <Route path="/properties/:id" element={<PropertyDetail />} />
      <Route path="/explore" element={<Explore />} />

      {/* AUTH ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

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