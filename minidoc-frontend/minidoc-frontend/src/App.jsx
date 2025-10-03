// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Usuarios from './pages/Usuarios/Usuarios';
import TestUsuarios from './pages/Test/Test-Usuarios';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect inicial al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Página de Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Página de Usuarios */}
        <Route path="/usuarios" element={<Usuarios />} />

        {/* Página de Test de Usuarios */}
        <Route path="/test-usuarios" element={<TestUsuarios />} />
        
        {/* Catch-all */}
        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
