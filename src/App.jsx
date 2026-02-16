// App.jsx - FIXED VERSION (Uses only RoleRoute)
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Pages
import Welcome from "./pages/Welcome";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Explore from "./pages/Explore";
import Brokers from "./pages/Brokers";
import BrokerDetail from "./pages/BrokerDetail";
import BrokerDashboard from "./pages/BrokerDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

// Components
import RoleRoute from "./components/RoleRoute";

import "./App.css";

function AppContent() {
  return (
    <Routes>
      {/* HOME/WELCOME PAGE */}
      <Route path="/" element={<Welcome />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      
      {/* PUBLIC ROUTES - No login required */}
      <Route path="/explore" element={<Explore />} />

      {/* AUTH ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PROTECTED ROUTES - Login required (all roles allowed) */}
      <Route
        path="/properties"
        element={
          <RoleRoute allowedRoles={['customer', 'broker', 'admin']}>
            <Properties />
          </RoleRoute>
        }
      />

      <Route
        path="/property/:id"
        element={
          <RoleRoute allowedRoles={['customer', 'broker', 'admin']}>
            <PropertyDetail />
          </RoleRoute>
        }
      />

      <Route
        path="/properties/:id"
        element={
          <RoleRoute allowedRoles={['customer', 'broker', 'admin']}>
            <PropertyDetail />
          </RoleRoute>
        }
      />

      <Route
        path="/brokers"
        element={
          <RoleRoute allowedRoles={['customer', 'broker', 'admin']}>
            <Brokers />
          </RoleRoute>
        }
      />

      <Route
        path="/brokers/:id"
        element={
          <RoleRoute allowedRoles={['customer', 'broker', 'admin']}>
            <BrokerDetail />
          </RoleRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <RoleRoute allowedRoles={['customer', 'broker', 'admin']}>
            <Profile />
          </RoleRoute>
        }
      />

      {/* BROKER-ONLY ROUTES */}
      <Route
        path="/broker/dashboard"
        element={
          <RoleRoute allowedRoles={['broker']}>
            <BrokerDashboard />
          </RoleRoute>
        }
      />

      <Route
        path="/broker/edit-profile"
        element={
          <RoleRoute allowedRoles={['broker']}>
            <div style={{padding: '100px', textAlign: 'center'}}>
              <h2>Edit Broker Profile Page</h2>
              <p>Create EditBrokerProfile.jsx component</p>
            </div>
          </RoleRoute>
        }
      />

      <Route
        path="/broker/complete-profile"
        element={
          <RoleRoute allowedRoles={['broker']}>
            <div style={{padding: '100px', textAlign: 'center'}}>
              <h2>Complete Broker Profile Page</h2>
              <p>Create CompleteBrokerProfile.jsx component</p>
            </div>
          </RoleRoute>
        }
      />

      <Route
        path="/broker/add-property"
        element={
          <RoleRoute allowedRoles={['broker']}>
            <div style={{padding: '100px', textAlign: 'center'}}>
              <h2>Add Property Page</h2>
              <p>Create AddProperty.jsx component</p>
            </div>
          </RoleRoute>
        }
      />

      <Route
        path="/properties/edit/:id"
        element={
          <RoleRoute allowedRoles={['broker']}>
            <div style={{padding: '100px', textAlign: 'center'}}>
              <h2>Edit Property Page</h2>
              <p>Create EditProperty.jsx component</p>
            </div>
          </RoleRoute>
        }
      />

      {/* ADMIN-ONLY ROUTES (Optional) */}
      {/* 
      <Route
        path="/admin/dashboard"
        element={
          <RoleRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </RoleRoute>
        }
      />
      */}

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