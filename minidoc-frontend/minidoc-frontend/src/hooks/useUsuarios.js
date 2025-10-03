// src/hooks/useUsuarios.js
import { useState, useEffect, useCallback } from 'react';
import { usuarioService } from '../services/usuarioService';

export const useUsuarios = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todos los registros
  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await usuarioService.getAll();
    
    if (result.success) {
      setData(result.data);
    } else {
      setError(result.error);
      setData([]);
    }
    
    setLoading(false);
  }, []);

  // Buscar con filtros
  const searchUsuarios = useCallback(async (filters) => {
    setLoading(true);
    setError(null);
    
    const result = await usuarioService.search(filters);
    
    if (result.success) {
      setData(result.data);
    } else {
      setError(result.error);
      setData([]);
    }
    
    setLoading(false);
  }, []);

  // Refrescar datos
  const refresh = useCallback(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  return {
    data,
    loading,
    error,
    fetchUsuarios,
    searchUsuarios,
    refresh,
    // Utilidades
    hasData: data.length > 0,
    isEmpty: !loading && data.length === 0 && !error
  };
};

export default useUsuarios;