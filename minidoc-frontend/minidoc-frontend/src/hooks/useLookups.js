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
      
      const response = await apiClient.get('/Lookups/all');
      
      console.log('✅ Lookups cargados:', response.data);

      // ✅ NORMALIZAR DATOS - El backend puede devolver con diferentes nombres de propiedades
      const normalizeArray = (arr) => {
        if (!Array.isArray(arr)) return [];
        
        return arr.map(item => ({
          // Normalizar id (puede venir como id, Id, idJerarquia, etc.)
          id: item.id || item.idJerarquia || item.idDestino || item.idNivel || 
              item.idCuerpo || item.idEscalafon || item.idTipoClasificacion || 
              item.idEstado || item.idAlcance,
          
          // Normalizar nombre/descripción
          nombre: item.nombre || item.detalle || item.descripcion,
          
          // Campos adicionales específicos
          letra: item.letra,
          sigla: item.sigla,
          iniciales: item.iniciales,
          detalle: item.detalle,
          descripcion: item.descripcion,
          cuatrigrama: item.cuatrigrama,
          
          // Preservar item original por si acaso
          _original: item
        }));
      };

      setLookups({
        jerarquias: normalizeArray(response.data.jerarquias || []),
        destinos: normalizeArray(response.data.destinos || []),
        niveles: normalizeArray(response.data.niveles || []),
        alcances: normalizeArray(response.data.alcances || []),
        cuerpos: normalizeArray(response.data.cuerpos || []),
        escalafones: normalizeArray(response.data.escalafones || []),
        tiposClasificacion: normalizeArray(response.data.tiposClasificacion || []),
        estados: normalizeArray(response.data.estados || [])
      });

      console.log('✅ Lookups procesados correctamente');
      
      // 🔍 DEBUG: Ver qué se cargó
      console.log('📊 Cantidades cargadas:', {
        jerarquias: normalizeArray(response.data.jerarquias || []).length,
        destinos: normalizeArray(response.data.destinos || []).length,
        niveles: normalizeArray(response.data.niveles || []).length,
        cuerpos: normalizeArray(response.data.cuerpos || []).length,
        escalafones: normalizeArray(response.data.escalafones || []).length,
        tiposClasificacion: normalizeArray(response.data.tiposClasificacion || []).length,
        estados: normalizeArray(response.data.estados || []).length
      });

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
      return item.nombre || item.detalle || item.letra || '';
    }
    
    if (lookupType === 'destinos') {
      return item.nombre || item.cuatrigrama || '';
    }
    
    if (lookupType === 'niveles') {
      return item.nombre || item.descripcion || '';
    }
    
    if (lookupType === 'cuerpos') {
      return item.descripcion || item.detalle || item.sigla || '';
    }
    
    if (lookupType === 'escalafones') {
      return item.descripcion || item.detalle || item.letra || '';
    }
    
    if (lookupType === 'tiposClasificacion') {
      return item.descripcion || item.nombre || '';
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