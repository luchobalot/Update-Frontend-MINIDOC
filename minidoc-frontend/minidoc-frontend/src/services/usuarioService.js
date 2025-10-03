// src/services/usuarioService.js
import apiClient from './apiClient';

/**
 * Servicio para gestión de usuarios MINIDOC
 * Endpoints: /api/UsuarioMinidoc
 */
export const usuarioService = {
  /**
   * Obtener todos los usuarios
   * @returns {Promise<Object>} - { success, data, error }
   */
  getAll: async () => {
    try {
      const response = await apiClient.get('/UsuarioMinidoc');
      
      if (response.data) {
        return {
          success: true,
          data: Array.isArray(response.data) ? response.data : []
        };
      }
      
      return {
        success: true,
        data: []
      };
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return {
        success: false,
        error: error.firstErrorMessage || error.response?.data?.title || 'Error al cargar usuarios',
        data: []
      };
    }
  },

  /**
   * Obtener usuario por ID
   * @param {string|number} usuarioId - ID del usuario
   * @returns {Promise<Object>} - { success, data, error }
   */
  getById: async (usuarioId) => {
    try {
      const response = await apiClient.get(`/UsuarioMinidoc/${usuarioId}`);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return {
        success: false,
        error: error.firstErrorMessage || error.response?.data?.title || 'Error al cargar usuario'
      };
    }
  },

  /**
   * Crear nuevo usuario (Auth + MINIDOC)
   * @param {Object} usuarioData - Datos del usuario a crear
   * @returns {Promise<Object>} - { success, data, error }
   */
  create: async (usuarioData) => {
    try {
      const response = await apiClient.post('/UsuarioMinidoc', usuarioData);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al crear usuario:', error);
      
      let errorMessage = 'Error al crear usuario';
      
      // Usar el mensaje formateado del interceptor
      if (error.firstErrorMessage) {
        errorMessage = error.firstErrorMessage;
      } else if (error.formattedErrors) {
        const errors = error.formattedErrors;
        const errorMessages = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('\n');
        errorMessage = errorMessages;
      } else if (error.response?.data?.title) {
        errorMessage = error.response.data.title;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  /**
   * Actualizar usuario (campos básicos)
   * @param {string|number} usuarioId - ID del usuario
   * @param {Object} usuarioData - Datos a actualizar
   * @returns {Promise<Object>} - { success, data, error }
   */
  update: async (usuarioId, usuarioData) => {
    try {
      const response = await apiClient.put(`/UsuarioMinidoc/${usuarioId}`, usuarioData);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      
      let errorMessage = 'Error al actualizar usuario';
      
      if (error.firstErrorMessage) {
        errorMessage = error.firstErrorMessage;
      } else if (error.response?.data?.title) {
        errorMessage = error.response.data.title;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  /**
   * Eliminar usuario
   * @param {string|number} usuarioId - ID del usuario
   * @returns {Promise<Object>} - { success, data, error }
   */
  delete: async (usuarioId) => {
    try {
      const response = await apiClient.delete(`/UsuarioMinidoc/${usuarioId}`);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      
      let errorMessage = 'Error al eliminar usuario';
      
      if (error.firstErrorMessage) {
        errorMessage = error.firstErrorMessage;
      } else if (error.response?.data?.title) {
        errorMessage = error.response.data.title;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  /**
   * Buscar usuarios con filtros (búsqueda local en frontend)
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise<Object>} - { success, data, error }
   */
  search: async (filters) => {
    try {
      // Obtener todos los usuarios y filtrar en frontend
      const result = await usuarioService.getAll();
      
      if (!result.success) {
        return result;
      }
      
      let filteredData = result.data;
      
      // Aplicar filtros si existen
      if (filters.searchValue) {
        const searchLower = filters.searchValue.toLowerCase();
        filteredData = filteredData.filter(usuario => 
          usuario.userName?.toLowerCase().includes(searchLower) ||
          usuario.matriculaRevista?.toLowerCase().includes(searchLower) ||
          usuario.apellido?.toLowerCase().includes(searchLower) ||
          usuario.nombre?.toLowerCase().includes(searchLower) ||
          usuario.jerarquia?.nombre?.toLowerCase().includes(searchLower)
        );
      }
      
      return {
        success: true,
        data: filteredData
      };
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      return {
        success: false,
        error: 'Error al buscar usuarios',
        data: []
      };
    }
  }
};

export default usuarioService;