// src/services/authService.js
import { authApiClient } from './apiClient';

/**
 * Login (autenticación con API JWT - Puerto 5278)
 */
export const login = async (logon, password) => {
  try {
    const response = await authApiClient.post('/v1.0/users/authenticate', {
      logon,
      password,
      instanceUri: '/api/v1.0/users/authenticate'
    });

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
 * Registrar nuevo usuario en AuthAPI (requiere supervisor logueado)
 * @param {string} supervisorId - ID del usuario autenticado (supervisor)
 * @param {Object} userData - { logon, password, passwordConfirmation }
 * @returns {Promise<Object>} - { id, userName }
 */
export const registerUser = async (supervisorId, userData) => {
  try {
    const response = await authApiClient.post(`/v1.0/users/${supervisorId}`, userData);
    console.log('✅ Usuario creado en AuthAPI:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creando usuario en AuthAPI:', error);
    throw error;
  }
};

/**
 * Obtener datos del usuario
 */
export const getUserData = async (userId) => {
  try {
    const response = await authApiClient.get(`/v1.0/users/${userId}`);
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
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  const expiry = localStorage.getItem('authTokenExpiry');
  if (!token || !expiry) return false;

  const expiryDate = new Date(expiry);
  const now = new Date();
  if (now >= expiryDate) {
    logout();
    return false;
  }
  return true;
};

/**
 * Obtener token e ID actual
 */
export const getToken = () => localStorage.getItem('authToken');
export const getCurrentUserId = () => localStorage.getItem('userId');
