// src/hooks/useLookups.js
import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';

export const useLookups = () => {
  const [lookups, setLookups] = useState({
    jerarquias: [],
    destinos: [],
    niveles: [],
    alcances: [],
    cuerpos: [],
    escalafones: [],
    tiposClasificacion: [],
    estados: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todos los lookups con UNA SOLA llamada
  const fetchLookups = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Cargando lookups desde /api/Lookups/all...');
      
      // UNA SOLA LLAMADA al endpoint consolidado
      const response = await apiClient.get('/Lookups/all');
      
      console.log('✅ Lookups cargados:', response.data);

      // Normalizar los datos
      setLookups({
        jerarquias: response.data.jerarquias || [],
        destinos: response.data.destinos || [],
        niveles: response.data.niveles || [],
        alcances: response.data.alcances || [],
        cuerpos: response.data.cuerpos || [],
        escalafones: response.data.escalafones || [],
        tiposClasificacion: response.data.tiposClasificacion || [],
        estados: response.data.estados || []
      });

      console.log('✅ Lookups procesados correctamente');
    } catch (err) {
      console.error('❌ Error al cargar lookups:', err);
      setError('Error al cargar datos de configuración');
    } finally {
      setLoading(false);
    }
  }, []);

  // Refrescar datos
  const refresh = useCallback(() => {
    console.log('🔄 Refrescando lookups...');
    fetchLookups();
  }, [fetchLookups]);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchLookups();
  }, [fetchLookups]);

  // Función helper para buscar el detalle por ID
  const getDetailById = useCallback((lookupType, id) => {
    if (!id) return '';
    
    const items = lookups[lookupType] || [];
    const item = items.find(item => item.id === parseInt(id));
    
    if (!item) return '';
    
    // Retornar el campo más apropiado según el tipo de lookup
    if (lookupType === 'jerarquias') {
      return item.nombre || item.iniciales || '';  // nombre = Detalle completo
    }
    
    if (lookupType === 'destinos') {
      return item.nombre || item.cuatrigrama || '';
    }
    
    if (lookupType === 'cuerpos') {
      return item.descripcion || '';  // descripcion = Detalle completo
    }
    
    if (lookupType === 'escalafones') {
      return item.descripcion || item.letra || '';  // descripcion primero (Detalle)
    }
    
    // Para el resto, priorizar descripción o nombre
    return item.descripcion || item.nombre || item.detalle || '';
  }, [lookups]);

  // Función helper para verificar si hay datos
  const hasData = useCallback((lookupType) => {
    return Array.isArray(lookups[lookupType]) && lookups[lookupType].length > 0;
  }, [lookups]);

  // Función helper para obtener conteos
  const getCounts = useCallback(() => {
    return {
      jerarquias: lookups.jerarquias.length,
      destinos: lookups.destinos.length,
      niveles: lookups.niveles.length,
      alcances: lookups.alcances.length,
      cuerpos: lookups.cuerpos.length,
      escalafones: lookups.escalafones.length,
      tiposClasificacion: lookups.tiposClasificacion.length,
      estados: lookups.estados.length,
      total: Object.values(lookups).reduce((sum, arr) => sum + arr.length, 0)
    };
  }, [lookups]);

  // Función helper para obtener un lookup completo por ID
  const getLookupById = useCallback((lookupType, id) => {
    if (!id) return null;
    const items = lookups[lookupType] || [];
    return items.find(item => item.id === parseInt(id)) || null;
  }, [lookups]);

  return {
    lookups,
    loading,
    error,
    refresh,
    getDetailById,
    getLookupById,
    hasData,
    getCounts,
    // Utilidades
    isReady: !loading && !error,
    isEmpty: !loading && Object.values(lookups).every(arr => arr.length === 0),
    hasErrors: !!error
  };
};

export default useLookups;