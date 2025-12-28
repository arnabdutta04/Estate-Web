import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Brokers from './pages/Brokers';
import './App.css';
import ProtectedRoute from "./components/ProtectedRoute";

<Routes>
  <Route
    path="/home"
    element={
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    }
  />
  <Route
    path="/properties"
    element={
      <ProtectedRoute>
        <Properties />
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
</Routes>
function AppContent() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/';

  return (
    <div className="App">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Welcome />} />
         <Route path="/home" element={<Home />} />
        <Route path="/brokers" element={<Brokers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
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