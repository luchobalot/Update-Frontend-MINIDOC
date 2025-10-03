// src/pages/Login/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService, getUserData } from '../../services/authService';
import styles from './Login.module.scss';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      // 1. Autenticar y obtener token + userId
      const authResponse = await loginService(formData.username, formData.password);

      // 2. Obtener datos completos del usuario usando su userId
      const userDataResponse = await getUserData(authResponse.userId);

      // 3. Construir objeto
      const loggedUser = {
        logon: formData.username,
        jerarquia: userDataResponse.rank || 'N/A',
        apellido: userDataResponse.lastName || 'Usuario',
        nombre: userDataResponse.firstName || '',
        organizacion: userDataResponse.organization || '',
        nivel: userDataResponse.level || '',
        destino: userDataResponse.unit || '',
        token: authResponse.token,
        userId: authResponse.userId,
        fechaExpiracion: authResponse.fechaExpiracion,
      };

      setUserData(loggedUser);
      setIsLoading(false);
      setIsTransitioning(true);

      // Transición para mostrar pantalla de bienvenida
      setTimeout(() => {
        setLoginSuccess(true);
        setIsTransitioning(false);
      }, 300);

      // Voy a esta pagina de momento para testeo
      //setTimeout(() => {
      //  navigate('/test-personas');
      //}, 4000);
    } catch (error) {
      console.error('Error de login:', error);
      
      let errorMsg = 'Error de autenticación. Por favor, intente nuevamente.';
      
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors;
        const firstErrorKey = Object.keys(apiErrors)[0];
        const firstErrorArray = apiErrors[firstErrorKey];
        
        if (firstErrorArray && firstErrorArray.length > 0) {
          errorMsg = firstErrorArray[0];
        }
      } else if (error.firstErrorMessage) {
        errorMsg = error.firstErrorMessage;
      } else if (error.code === 'ECONNABORTED') {
        errorMsg = 'Tiempo de espera agotado. Verifique su conexión.';
      } else if (error.code === 'ERR_NETWORK' || !error.response) {
        errorMsg = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
      } else if (error.response?.status === 500) {
        errorMsg = 'Error del servidor. Por favor, intente más tarde.';
      } else if (error.response?.status === 401) {
        errorMsg = 'Credenciales inválidas. Verifique su usuario y contraseña.';
      }
      
      setErrorMessage(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.backgroundPattern}>
        <i className={`${styles.floatingIcon} bx bx-envelope`}></i>
        <i className={`${styles.floatingIcon} bx bx-send`}></i>
        <i className={`${styles.floatingIcon} bx bx-message-dots`}></i>
        <i className={`${styles.floatingIcon} bx bx-archive`}></i>
        <i className={`${styles.floatingIcon} bx bx-transfer`}></i>
        <i className={`${styles.floatingIcon} bx bx-download`}></i>
      </div>

      <div className={styles.loginContainer}>
        {!loginSuccess ? (
          <div
            className={`${styles.loginContent} ${
              isTransitioning ? styles.exiting : ''
            }`}
          >
            <div className={styles.loginHeader}>
              <div className={styles.logoContainer}>
                <div className={styles.logoIcon}>
                  <i className="bx bx-envelope"></i>
                </div>
                <h1 className={styles.appTitle}>MINIDOC</h1>
                <p className={styles.appSubtitle}>
                  Sistema de Gestión y Distribución de GFH
                </p>
              </div>
            </div>

            <form className={styles.loginForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="username">
                  Usuario
                </label>
                <div className={styles.inputWrapper}>
                  <i className={`${styles.inputIcon} bx bx-user`}></i>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className={styles.formInput}
                    placeholder="Ingrese su usuario"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoComplete="username"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="password">
                  Contraseña
                </label>
                <div className={styles.inputWrapper}>
                  <i className={`${styles.inputIcon} bx bx-lock-alt`}></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className={styles.formInput}
                    placeholder="Ingrese su contraseña"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={togglePassword}
                    disabled={isLoading}
                  >
                    <i className={`bx ${showPassword ? 'bx-show' : 'bx-hide'}`}></i>
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className={styles.errorMessage}>
                  <i className="bx bx-error-circle"></i>
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className={styles.formExtras}>
                <div className={styles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    id="remember"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <label htmlFor="remember">Recordarme</label>
                </div>
                <a href="#" className={styles.forgotLink}>
                  ¿Olvidó su contraseña?
                </a>
              </div>

              <button
                type="submit"
                className={`${styles.loginButton} ${
                  isLoading ? styles.loading : ''
                }`}
                disabled={isLoading}
              >
                {!isLoading && 'Iniciar Sesión'}
              </button>
            </form>

            <div className={styles.loginFooter}>
              <div>
                Servicio de Análisis Operativo, Armas y Guerra Electrónica
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.welcomeScreen}>
            <div className={styles.welcomeContent}>
              <div className={styles.checkIcon}>
                <i className="bx bx-check-circle"></i>
              </div>
              <h2 className={styles.welcomeTitle}>¡Bienvenido!</h2>
              <p className={styles.welcomeMessage}>
                <span className={styles.userRank}>{userData?.jerarquia}</span>{' '}
                {userData?.apellido} {userData?.nombre}
              </p>
              <p className={styles.welcomeSubtext}>
                Accediendo al sistema MINIDOC...
              </p>
              <div className={styles.loadingDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;