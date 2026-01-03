// App.jsx
import React from "react";
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Welcome from "./pages/Welcome";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Brokers from "./pages/Brokers";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/navbar";
import Profile from "./pages/Profile";
import "./App.css";

function AppContent() {
  const location = useLocation();
  
  // Pages where navbar should NOT appear
  const noNavbarPages = ["/", "/login", "/register"];
  const showNavbar = !noNavbarPages.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* WELCOME = HOME */}
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
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
        <Route
           path="/profile"
           element={
             <ProtectedRoute>
               <Profile />
             </ProtectedRoute>
         }
        />
        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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