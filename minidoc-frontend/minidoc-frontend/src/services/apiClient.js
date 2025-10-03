// src/services/apiClient.js
import axios from 'axios';

// ==================== API PRINCIPAL DE MINIDOC ====================
// Crear instancia de axios para el backend de MINIDOC (puerto 7043)
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7043/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== API DE AUTENTICACIÓN JWT ====================
// Crear instancia separada para la API de autenticación (puerto 5278)
const authApiClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5278/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== INTERCEPTOR DE REQUEST (MINIDOC) ====================
apiClient.interceptors.request.use(
  (config) => {
    // Obtener el token del localStorage
    const token = localStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log solo en desarrollo
    if (import.meta.env.DEV) {
      console.log('🔵 MINIDOC API Request:', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// ==================== INTERCEPTOR DE REQUEST (AUTH) ====================
authApiClient.interceptors.request.use(
  (config) => {
    // La API de auth no necesita token para login
    // Pero lo agregamos por si acaso para otros endpoints
    const token = localStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log solo en desarrollo
    if (import.meta.env.DEV) {
      console.log('🟢 AUTH API Request:', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('Auth Request Error:', error);
    return Promise.reject(error);
  }
);

// ==================== INTERCEPTOR DE RESPONSE (MINIDOC) ====================
apiClient.interceptors.response.use(
  (response) => {
    // Log solo en desarrollo
    if (import.meta.env.DEV) {
      console.log('✅ MINIDOC API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    // Log del error
    console.error('❌ MINIDOC API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });
    
    // Manejar error 401 - No autorizado
    if (error.response?.status === 401) {
      // Limpiar token y redirigir al login
      localStorage.removeItem('authToken');
      localStorage.removeItem('authTokenExpiry');
      localStorage.removeItem('userId');
      
      // Solo redirigir si no estamos ya en login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Manejar error 403 - Prohibido
    if (error.response?.status === 403) {
      console.error('Acceso prohibido: No tienes permisos para realizar esta acción');
    }
    
    // Transformar errores de ProblemDetails para uso más fácil
    if (error.response?.data) {
      const errorData = error.response.data;
      
      // Formato ASP.NET Core ProblemDetails
      if (errorData.errors) {
        const formattedErrors = {};
        const allMessages = [];
        
        Object.entries(errorData.errors).forEach(([field, messages]) => {
          const messageArray = Array.isArray(messages) ? messages : [messages];
          formattedErrors[field] = messageArray;
          allMessages.push(...messageArray);
        });
        
        error.formattedErrors = formattedErrors;
        error.errorMessages = allMessages;
        error.firstErrorMessage = allMessages[0] || errorData.title || 'Error desconocido';
      } else if (errorData.title) {
        error.firstErrorMessage = errorData.title;
      } else if (errorData.message) {
        error.firstErrorMessage = errorData.message;
      }
    }
    
    return Promise.reject(error);
  }
);

// ==================== INTERCEPTOR DE RESPONSE (AUTH) ====================
authApiClient.interceptors.response.use(
  (response) => {
    // Log solo en desarrollo
    if (import.meta.env.DEV) {
      console.log('✅ AUTH API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    // Log del error
    console.error('❌ AUTH API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });
    
    // Transformar errores
    if (error.response?.data) {
      const errorData = error.response.data;
      
      if (errorData.errors) {
        const formattedErrors = {};
        const allMessages = [];
        
        Object.entries(errorData.errors).forEach(([field, messages]) => {
          const messageArray = Array.isArray(messages) ? messages : [messages];
          formattedErrors[field] = messageArray;
          allMessages.push(...messageArray);
        });
        
        error.formattedErrors = formattedErrors;
        error.errorMessages = allMessages;
        error.firstErrorMessage = allMessages[0] || errorData.title || 'Error de autenticación';
      } else if (errorData.title) {
        error.firstErrorMessage = errorData.title;
      } else if (errorData.message) {
        error.firstErrorMessage = errorData.message;
      }
    }
    
    return Promise.reject(error);
  }
);

// Exportar ambos clientes
export default apiClient; // Cliente principal para MINIDOC
export { authApiClient }; // Cliente para autenticación