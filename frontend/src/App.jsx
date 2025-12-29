import React from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Brokers from "./pages/Brokers";

import "./App.css";

function AppContent() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/";

  return (
    <div className="App">
      {showNavbar && <Navbar />}

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* CUSTOMER */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["CUSTOMER", "BROKER"]}>
                <Home />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/properties"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["CUSTOMER", "BROKER"]}>
                <Properties />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/properties/:id"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["CUSTOMER", "BROKER"]}>
                <PropertyDetail />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* BROKER */}
        <Route
          path="/brokers"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["BROKER"]}>
                <Brokers />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* PENDING BROKER */}
        <Route
          path="/broker/onboarding"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["PENDING_BROKER"]}>
                <div style={{ padding: 40 }}>
                  <h2>Complete Broker Profile</h2>
                  <p>Please complete your broker details to activate your account.</p>
                </div>
              </RoleRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
