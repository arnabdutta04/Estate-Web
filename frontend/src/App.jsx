import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Welcome from "./pages/Welcome";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Brokers from "./pages/Brokers";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function AppContent() {
  return (
    <Routes>
      {/* WELCOME = HOME */}
      <Route path="/" element={<Welcome />} />

      {/* PROTECTED ROUTES */}
      <Route
        path="/properties"
        element={
          <ProtectedRoute>
            <Properties />
          </ProtectedRoute>
        }
      />

      <Route
        path="/properties/:id"
        element={
          <ProtectedRoute>
            <PropertyDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/brokers"
        element={
          <ProtectedRoute>
            <Brokers />
          </ProtectedRoute>
        }
      />

      {/* AUTH (still needed for modal fallback / deep links) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
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
