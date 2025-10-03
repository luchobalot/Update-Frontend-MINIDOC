// src/services/authService.js
import { authApiClient } from './apiClient';

/**
 * Login (autenticación con API JWT - Puerto 5278)
 * @param {string} logon - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise<Object>} - Datos de autenticación (token, userId, fechaExpiracion)
 */
export const login = async (logon, password) => {
  try {
    const response = await authApiClient.post('/v1.0/users/authenticate', {
      logon,
      password,
      instanceUri: '/api/v1.0/users/authenticate'
    });

    // Guardar token en localStorage
    const { token, fechaExpiracion, userId } = response.data;
    localStorage.setItem('authToken', token);
    localStorage.setItem('authTokenExpiry', fechaExpiracion);
    localStorage.setItem('userId', userId);

    console.log('✅ Login exitoso:', { userId, fechaExpiracion });

    return response.data;
  } catch (error) {
    console.error('❌ Error en login:', error);
    throw error;
  }
};

/**
 * Obtener datos del usuario por ID (desde API JWT)
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} - Datos del usuario
 */
export const getUserData = async (userId) => {
  try {
    const response = await authApiClient.get(`/v1.0/users/${userId}`);
    console.log('✅ Datos de usuario obtenidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo datos del usuario:', error);
    throw error;
  }
};

/**
 * Logout (limpiar sesión)
 */
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authTokenExpiry');
  localStorage.removeItem('userId');
  console.log('✅ Sesión cerrada');
};

/**
 * Verificar si el usuario está autenticado
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  const expiry = localStorage.getItem('authTokenExpiry');
  
  if (!token || !expiry) {
    return false;
  }
  
  // Verificar si el token expiró
  const expiryDate = new Date(expiry);
  const now = new Date();
  
  if (now >= expiryDate) {
    logout();
    return false;
  }
  
  return true;
};

/**
 * Obtener el token actual
 * @returns {string|null}
 */
export const getToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Obtener el ID del usuario actual
 * @returns {string|null}
 */
export const getCurrentUserId = () => {
  return localStorage.getItem('userId');
};