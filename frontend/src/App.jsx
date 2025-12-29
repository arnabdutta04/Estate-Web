import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Welcome from "./pages/Welcome";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Brokers from "./pages/Brokers";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function AppContent() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* WELCOME = HOME */}
        <Route path="/" element={<Welcome />} />

        {/* PROTECTED */}
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
