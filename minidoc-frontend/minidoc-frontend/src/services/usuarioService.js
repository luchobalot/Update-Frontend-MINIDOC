// src/services/usuarioService.js
import apiClient from './apiClient';

/**
 * Servicio de Usuarios MINIDOC
 * Ahora todo pasa por el backend de MINIDOC:
 *   - El backend crea el usuario en AuthAPI.
 *   - Luego guarda la información personal en MINIDOC.
 * El front NO llama más a AuthAPI directamente.
 */
export const usuarioService = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/UsuarioMinidoc');
      return { success: true, data: response.data || [] };
    } catch (error) {
      console.error('❌ Error al obtener usuarios:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al cargar usuarios',
        data: []
      };
    }
  },

  getById: async (usuarioId) => {
    try {
      const response = await apiClient.get(`/UsuarioMinidoc/${usuarioId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error al obtener usuario:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al cargar usuario'
      };
    }
  },

  /**
   * Crear nuevo usuario completo (AuthAPI + MINIDOC)
   * El backend se encarga de todo el flujo.
   */
  create: async (usuarioData) => {
    try {
      const response = await apiClient.post('/UsuarioMinidoc', usuarioData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error al crear usuario:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al crear usuario'
      };
    }
  },

  update: async (usuarioId, usuarioData) => {
    try {
      const response = await apiClient.put(`/UsuarioMinidoc/${usuarioId}`, usuarioData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error al actualizar usuario:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al actualizar usuario'
      };
    }
  },

  delete: async (usuarioId) => {
    try {
      await apiClient.delete(`/UsuarioMinidoc/${usuarioId}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Error al eliminar usuario:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al eliminar usuario'
      };
    }
  }
};

export default usuarioService;
