import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Albums from './pages/Albums';
import Photos from './pages/Photos';
import About from './pages/About';
import AlbumDetail from './pages/AlbumDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/albums" element={
                <ProtectedRoute>
                  <Albums />
                </ProtectedRoute>
              } />
              <Route path="/album/:id" element={
                <ProtectedRoute>
                  <AlbumDetail />
                </ProtectedRoute>
              } />
              <Route path="/photos" element={
                <ProtectedRoute>
                  <Photos />
                </ProtectedRoute>
              } />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
