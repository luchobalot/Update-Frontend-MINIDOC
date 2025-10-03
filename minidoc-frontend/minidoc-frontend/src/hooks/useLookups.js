// src/hooks/useLookups.js
import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';

/**
 * Hook para cargar lookups/catálogos desde el backend de MINIDOC
 * Endpoints: https://localhost:7043/api/{Entidad}
 */
export const useLookups = () => {
  const [lookups, setLookups] = useState({
    jerarquias: [],
    destinos: [],
    niveles: [],
    alcances: [],
    cuerpos: [],
    escalafones: [],
    tiposClasificacion: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función genérica para obtener datos de un endpoint
  const fetchLookup = async (endpoint, entityName) => {
    try {
      console.log(`📥 Cargando ${entityName} desde /${endpoint}`);
      const response = await apiClient.get(`/${endpoint}`);
      console.log(`✅ ${entityName} cargados:`, response.data?.length || 0, 'registros');
      return response.data || [];
    } catch (error) {
      console.error(`❌ Error al cargar ${entityName}:`, error);
      return [];
    }
  };

  // Cargar todos los datos de lookup
  const fetchLookups = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Iniciando carga de lookups desde MINIDOC API...');
      
      // Ejecutar todas las peticiones en paralelo
      const [
        jerarquias,
        destinos,
        niveles,
        alcances,
        cuerpos,
        escalafones,
        tiposClasificacion
      ] = await Promise.all([
        fetchLookup('Jerarquia', 'Jerarquías'),
        fetchLookup('Destino', 'Destinos'),
        fetchLookup('Nivel', 'Niveles'),
        fetchLookup('Alcance', 'Alcances'),
        fetchLookup('Cuerpo', 'Cuerpos'),
        fetchLookup('Escalafon', 'Escalafones'),
        fetchLookup('TipoClasificacion', 'Tipos de Clasificación')
      ]);

      // Normalizar datos (en caso de que vengan con diferentes estructuras)
      const newLookups = {
        jerarquias: jerarquias.map(item => ({
          id: item.id || item.idJerarquia,
          nombre: item.nombre,
          iniciales: item.iniciales
        })),
        destinos: destinos.map(item => ({
          id: item.id || item.idDestino,
          nombre: item.nombre,
          cuatrigrama: item.cuatrigrama,
          nroDestino: item.nroDestino
        })),
        niveles: niveles.map(item => ({
          id: item.id || item.idNivel,
          nombre: item.nombre,
          valor: item.valor
        })),
        alcances: alcances.map(item => ({
          id: item.id || item.idAlcance,
          nombre: item.nombre,
          valor: item.valor
        })),
        cuerpos: cuerpos.map(item => ({
          id: item.id || item.idCuerpo,
          descripcion: item.descripcion,
          detalle: item.detalle
        })),
        escalafones: escalafones.map(item => ({
          id: item.id || item.idEscalafon || item.idEscalafo,
          letra: item.letra,
          descripcion: item.descripcion
        })),
        tiposClasificacion: tiposClasificacion.map(item => ({
          id: item.id || item.idTipoClasificacion || item.idClasificacion,
          descripcion: item.descripcion,
          detalle: item.detalle
        }))
      };

      console.log('✅ Lookups cargados exitosamente:', {
        jerarquias: newLookups.jerarquias.length,
        destinos: newLookups.destinos.length,
        niveles: newLookups.niveles.length,
        alcances: newLookups.alcances.length,
        cuerpos: newLookups.cuerpos.length,
        escalafones: newLookups.escalafones.length,
        tiposClasificacion: newLookups.tiposClasificacion.length
      });

      setLookups(newLookups);
    } catch (err) {
      console.error('❌ Error en fetchLookups:', err);
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
      return item.nombre || item.iniciales || '';
    }
    
    if (lookupType === 'destinos') {
      return item.nombre || item.cuatrigrama || '';
    }
    
    if (lookupType === 'escalafones') {
      return item.letra || item.descripcion || '';
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