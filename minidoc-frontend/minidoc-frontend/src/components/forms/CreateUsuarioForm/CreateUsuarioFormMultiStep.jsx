// src/components/forms/CreateUsuarioForm/CreateUsuarioFormMultiStep.jsx
import React, { useState } from 'react';
import { useLookups } from '../../../hooks/useLookups';
import styles from './CreateUsuarioFormMultiStep.module.scss';
import { usuarioService } from '../../../services/usuarioService';

const CreateUsuarioFormMultiStep = ({ onSubmit, onCancel, loading = false }) => {
  const { lookups, loading: lookupsLoading, error: lookupsError, refresh } = useLookups();
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    matriculaRevista: '',
    apellido: '',
    nombre: '',
    jerarquiaId: '',
    destinoId: '',
    nivelId: '',
    idCuerpo: '',
    idEscalafon: '',
    idTipoClasificacion: '',
    confianza: false,
    superConfianza: false,
    userName: '',
    password: '',
    passwordConfirmation: ''
  });

  

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case 'matriculaRevista':
        if (!/^\d{7}$/.test(value)) return 'Debe tener exactamente 7 dígitos';
        return '';
      case 'apellido':
      case 'nombre':
        if (!value?.trim()) return 'Este campo es obligatorio';
        return '';
      case 'jerarquiaId':
      case 'nivelId':
      case 'idTipoClasificacion':
        if (!value) return 'Este campo es obligatorio';
        return '';
      case 'userName':
        if (!value?.trim()) return 'El nombre de usuario es obligatorio';
        if (value.length < 3) return 'Debe tener al menos 3 caracteres';
        return '';
      case 'password':
        if (!value) return 'La contraseña es obligatoria';
        if (value.length < 6) return 'Debe tener al menos 6 caracteres';
        return '';
      case 'passwordConfirmation':
        if (!value) return 'Debe confirmar la contraseña';
        if (value !== formData.password) return 'Las contraseñas no coinciden';
        return '';
      default:
        return '';
    }
  };

  const validateStep = (step) => {
    const stepFields = {
      1: ['matriculaRevista', 'apellido', 'nombre'],
      2: ['jerarquiaId'],
      3: ['nivelId', 'idTipoClasificacion'],
      4: ['userName', 'password', 'passwordConfirmation']
    };

    const fieldsToValidate = stepFields[step] || [];
    const newErrors = {};
    let isValid = true;

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(prev => ({ ...prev, ...newErrors }));
    setTouched(prev => {
      const newTouched = { ...prev };
      fieldsToValidate.forEach(field => {
        newTouched[field] = true;
      });
      return newTouched;
    });

    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, type === 'checkbox' ? checked : value)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setSubmitting(true);
    setShowError(false);
    setErrorMessage('');

    try {
      // Nuevo flujo: el backend de MINIDOC crea todo (Auth + Minidoc)
      const payload = {
        Logon: formData.userName.trim(),
        Password: formData.password,
        PasswordConfirmation: formData.passwordConfirmation,
        MatriculaRevista: formData.matriculaRevista,
        Apellido: formData.apellido.trim(),
        Nombre: formData.nombre.trim(),
        JerarquiaId: parseInt(formData.jerarquiaId, 10),
        DestinoId: formData.destinoId ? parseInt(formData.destinoId, 10) : null,
        NivelId: parseInt(formData.nivelId, 10),
        IdTipoClasificacion: parseInt(formData.idTipoClasificacion, 10),
        IdEscalafon: formData.idEscalafon ? parseInt(formData.idEscalafon, 10) : null,
        IdCuerpo: formData.idCuerpo ? parseInt(formData.idCuerpo, 10) : null,
        Confianza: formData.confianza,
        SuperConfianza: formData.superConfianza
      };

      const result = await usuarioService.create(payload);

      if (!result.success) {
        throw new Error(result.error || 'Error al registrar usuario en MINIDOC.');
      }

      setShowSuccess(true);
    } catch (error) {
      console.error('❌ Error en creación de usuario:', error);
      setShowError(true);
      setErrorMessage(
        error.message || 'Error al crear el usuario. Por favor, intente nuevamente.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      matriculaRevista: '',
      apellido: '',
      nombre: '',
      jerarquiaId: '',
      destinoId: '',
      nivelId: '',
      idCuerpo: '',
      idEscalafon: '',
      idTipoClasificacion: '',
      confianza: false,
      superConfianza: false,
      userName: '',
      password: '',
      passwordConfirmation: ''
    });
    setErrors({});
    setTouched({});
    setCurrentStep(1);
    setShowSuccess(false);
    setShowError(false);
    setErrorMessage('');
  };

  const getSelectText = (key, id) => {
    const list = lookups?.[key];
    if (!Array.isArray(list)) return '';
    const found = list.find(item => item.id === Number(id));
    return found ? (found.nombre || found.descripcion || '') : '';
  };

  if (lookupsLoading) return <p>Cargando datos...</p>;
  if (lookupsError) return <p>Error al cargar datos: {lookupsError}</p>;

  if (showSuccess) {
    return (
      <div className={styles.formContainer}>
        <div className={styles.successMessage}>
          <i className='bx bx-check'></i>
          <h3>¡Usuario Creado Exitosamente!</h3>
          <p>El usuario ha sido registrado correctamente en el sistema.</p>
          <button onClick={handleReset} className={styles.btnPrimary}>
            Crear Otro Usuario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.progressContainer}>
        <div className={styles.progressSteps}>
          <div className={styles.progressLine}></div>
          
          <div 
            className={styles.progressLineActive}
            style={{ 
              width: currentStep === 1 
                ? '0%' 
                : currentStep === totalSteps
                  ? 'calc(100% - 40px)'
                  : `calc((100% - 40px) * ${(currentStep - 1) / (totalSteps - 1)})`
            }}
          ></div>
          
          {[
            { num: 1, label: 'Personal' },
            { num: 2, label: 'Militar' },
            { num: 3, label: 'Clasificación' },
            { num: 4, label: 'Acceso' },
            { num: 5, label: 'Confirmar' }
          ].map(step => (
            <div 
              key={step.num}
              className={`${styles.step} ${
                currentStep === step.num ? styles.active : ''
              } ${currentStep > step.num ? styles.completed : ''}`}
            >
              <div className={styles.stepCircle}>
                {currentStep > step.num ? (
                  <i className='bx bx-check'></i>
                ) : (
                  step.num
                )}
              </div>
              <div className={styles.stepLabel}>{step.label}</div>
            </div>
          ))}
        </div>
      </div>

      {showError && (
        <div className={styles.errorBanner}>
          <div className={styles.errorContent}>
            <div className={styles.errorIcon}>
              <i className='bx bx-error-circle'></i>
            </div>
            <div className={styles.errorText}>
              <h4>Error al crear usuario</h4>
              <p>{errorMessage}</p>
            </div>
          </div>
          <button 
            className={styles.closeError}
            onClick={() => setShowError(false)}
          >
            <i className='bx bx-x'></i>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formContent}>
          
          {currentStep === 1 && (
            <div className={styles.formStep}>
              <h3 className={styles.stepTitle}>
                <i className='bx bx-id-card'></i>
                Datos Personales
              </h3>
              <div className={`${styles.formGrid} ${styles.threeColumns}`}>
                <FormField
                  label="Matrícula de Revista (7 dígitos)"
                  name="matriculaRevista"
                  required
                  error={errors.matriculaRevista}
                  touched={touched.matriculaRevista}
                >
                  <input
                    type="text"
                    name="matriculaRevista"
                    value={formData.matriculaRevista}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="1234567"
                    maxLength={7}
                    className={styles.formInput}
                    disabled={submitting}
                  />
                </FormField>

                <FormField
                  label="Apellido"
                  name="apellido"
                  required
                  error={errors.apellido}
                  touched={touched.apellido}
                >
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ingrese apellido"
                    maxLength={50}
                    className={styles.formInput}
                    disabled={submitting}
                  />
                </FormField>

                <FormField
                  label="Nombre"
                  name="nombre"
                  required
                  error={errors.nombre}
                  touched={touched.nombre}
                >
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ingrese nombre"
                    maxLength={50}
                    className={styles.formInput}
                    disabled={submitting}
                  />
                </FormField>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className={styles.formStep}>
              <h3 className={styles.stepTitle}>
                <i className='bx bx-shield'></i>
                Información Militar
              </h3>
              <div className={styles.formGrid}>
                <FormField
                  label="Jerarquía"
                  name="jerarquiaId"
                  required
                  error={errors.jerarquiaId}
                  touched={touched.jerarquiaId}
                >
                  <select
                    name="jerarquiaId"
                    value={formData.jerarquiaId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={styles.formSelect}
                    disabled={submitting}
                  >
                    <option value="">Seleccionar jerarquía</option>
                    {lookups.jerarquias?.map(j => (
                      <option key={`jerarquia-${j.id}`} value={j.id}>
                        {j.nombre}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  label="Destino (Opcional)"
                  name="destinoId"
                >
                  <select
                    name="destinoId"
                    value={formData.destinoId}
                    onChange={handleChange}
                    className={styles.formSelect}
                    disabled={submitting}
                  >
                    <option value="">Seleccionar destino</option>
                    {lookups.destinos?.map(d => (
                      <option key={`destino-${d.id}`} value={d.id}>
                        {d.nombre}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Cuerpo (Opcional)" name="idCuerpo">
                  <select
                    name="idCuerpo"
                    value={formData.idCuerpo}
                    onChange={handleChange}
                    className={styles.formSelect}
                    disabled={submitting}
                  >
                    <option value="">Seleccionar cuerpo</option>
                    {lookups.cuerpos?.map(c => (
                      <option key={`cuerpo-${c.id}`} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Escalafón (Opcional)" name="idEscalafon">
                  <select
                    name="idEscalafon"
                    value={formData.idEscalafon}
                    onChange={handleChange}
                    className={styles.formSelect}
                    disabled={submitting}
                  >
                    <option value="">Seleccionar escalafón</option>
                    {lookups.escalafones?.map(e => (
                      <option key={`escalafon-${e.id}`} value={e.id}>
                        {e.nombre}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className={styles.formStep}>
              <h3 className={styles.stepTitle}>
                <i className='bx bx-layer'></i>
                Clasificación y Permisos
              </h3>
              <div className={styles.formGrid}>
                <FormField
                  label="Nivel"
                  name="nivelId"
                  required
                  error={errors.nivelId}
                  touched={touched.nivelId}
                >
                  <select
                    name="nivelId"
                    value={formData.nivelId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={styles.formSelect}
                    disabled={submitting}
                  >
                    <option value="">Seleccionar nivel</option>
                    {lookups.niveles?.map(n => (
                      <option key={`nivel-${n.id}`} value={n.id}>
                        {n.nombre}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  label="Tipo de Clasificación"
                  name="idTipoClasificacion"
                  required
                  error={errors.idTipoClasificacion}
                  touched={touched.idTipoClasificacion}
                >
                  <select
                    name="idTipoClasificacion"
                    value={formData.idTipoClasificacion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={styles.formSelect}
                    disabled={submitting}
                  >
                    <option value="">Seleccionar tipo</option>
                    {lookups.tiposClasificacion?.map(t => (
                      <option key={`tipo-${t.id}`} value={t.id}>
                        {t.nombre}
                      </option>
                    ))}
                  </select>
                </FormField>

                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.formLabel}>Permisos Especiales</label>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        name="confianza"
                        checked={formData.confianza}
                        onChange={handleChange}
                        className={styles.checkboxInput}
                        disabled={submitting}
                      />
                      <span className={styles.checkboxLabel}>Confianza</span>
                    </label>
                    <label className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        name="superConfianza"
                        checked={formData.superConfianza}
                        onChange={handleChange}
                        className={styles.checkboxInput}
                        disabled={submitting}
                      />
                      <span className={styles.checkboxLabel}>Super Confianza</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className={styles.formStep}>
              <h3 className={styles.stepTitle}>
                <i className='bx bx-lock-alt'></i>
                Datos de Acceso
              </h3>
              <div className={`${styles.formGrid} ${styles.threeColumns}`}>
                <FormField
                  label="Usuario (Logon)"
                  name="userName"
                  required
                  error={errors.userName}
                  touched={touched.userName}
                >
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ingrese nombre de usuario"
                    maxLength={100}
                    className={styles.formInput}
                    disabled={submitting}
                  />
                </FormField>

                <FormField
                  label="Contraseña"
                  name="password"
                  required
                  error={errors.password}
                  touched={touched.password}
                >
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ingrese contraseña"
                    maxLength={50}
                    className={styles.formInput}
                    disabled={submitting}
                  />
                </FormField>

                <FormField
                  label="Confirmar Contraseña"
                  name="passwordConfirmation"
                  required
                  error={errors.passwordConfirmation}
                  touched={touched.passwordConfirmation}
                >
                  <input
                    type="password"
                    name="passwordConfirmation"
                    value={formData.passwordConfirmation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Confirme la contraseña"
                    maxLength={50}
                    className={styles.formInput}
                    disabled={submitting}
                  />
                </FormField>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className={styles.formStep}>
              <h3 className={styles.stepTitle}>
                <i className='bx bx-check-circle'></i>
                Revisar y Confirmar
              </h3>

              <div className={styles.reviewSection}>
                <h4 className={styles.reviewSectionTitle}>
                  <i className='bx bx-id-card'></i>
                  Datos Personales
                </h4>
                <div className={styles.reviewGrid}>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>Matrícula de Revista</span>
                    <span className={styles.reviewValue}>
                      {formData.matriculaRevista || 'No especificado'}
                    </span>
                  </div>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>Apellido</span>
                    <span className={styles.reviewValue}>
                      {formData.apellido || 'No especificado'}
                    </span>
                  </div>
                  <div className={`${styles.reviewItem} ${styles.fullWidth}`}>
                    <span className={styles.reviewLabel}>Nombre</span>
                    <span className={styles.reviewValue}>
                      {formData.nombre || 'No especificado'}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.reviewSection}>
                <h4 className={styles.reviewSectionTitle}>
                  <i className='bx bx-shield'></i>
                  Información Militar
                </h4>
                <div className={styles.reviewGrid}>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>Jerarquía</span>
                    <span className={styles.reviewValue}>
                      {getSelectText('jerarquias', formData.jerarquiaId)}
                    </span>
                  </div>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>Destino</span>
                    <span className={`${styles.reviewValue} ${!formData.destinoId ? styles.empty : ''}`}>
                      {getSelectText('destinos', formData.destinoId)}
                    </span>
                  </div>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>Cuerpo</span>
                    <span className={`${styles.reviewValue} ${!formData.idCuerpo ? styles.empty : ''}`}>
                      {getSelectText('cuerpos', formData.idCuerpo)}
                    </span>
                  </div>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>Escalafón</span>
                    <span className={`${styles.reviewValue} ${!formData.idEscalafon ? styles.empty : ''}`}>
                      {getSelectText('escalafones', formData.idEscalafon)}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.reviewSection}>
                <h4 className={styles.reviewSectionTitle}>
                  <i className='bx bx-layer'></i>
                  Clasificación y Permisos
                </h4>
                <div className={styles.reviewGrid}>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>Nivel</span>
                    <span className={styles.reviewValue}>
                      {getSelectText('niveles', formData.nivelId)}
                    </span>
                  </div>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>Tipo de Clasificación</span>
                    <span className={styles.reviewValue}>
                      {getSelectText('tiposClasificacion', formData.idTipoClasificacion)}
                    </span>
                  </div>
                  <div className={`${styles.reviewItem} ${styles.fullWidth}`}>
                    <span className={styles.reviewLabel}>Permisos Especiales</span>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                      <span className={`${styles.reviewCheckbox} ${!formData.confianza ? styles.inactive : ''}`}>
                        <i className='bx bx-check'></i>
                        Confianza
                      </span>
                      <span className={`${styles.reviewCheckbox} ${!formData.superConfianza ? styles.inactive : ''}`}>
                        <i className='bx bx-check'></i>
                        Super Confianza
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.reviewSection}>
                <h4 className={styles.reviewSectionTitle}>
                  <i className='bx bx-lock-alt'></i>
                  Datos de Acceso
                </h4>
                <div className={styles.reviewGrid}>
                  <div className={`${styles.reviewItem} ${styles.fullWidth}`}>
                    <span className={styles.reviewLabel}>Nombre de Usuario (Logon)</span>
                    <span className={styles.reviewValue}>
                      {formData.userName || 'No especificado'}
                    </span>
                  </div>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>Contraseña</span>
                    <span className={`${styles.reviewValue} ${styles.password}`}>
                      {formData.password ? '•'.repeat(formData.password.length) : 'No especificado'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={currentStep === 1 ? onCancel : handlePrevious}
            className={styles.btnSecondary}
            disabled={submitting}
          >
            <i className='bx bx-chevron-left'></i>
            {currentStep === 1 ? 'Cancelar' : 'Anterior'}
          </button>
          
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className={styles.btnPrimary}
              disabled={submitting}
            >
              Siguiente
              <i className='bx bx-chevron-right'></i>
            </button>
          ) : (
            <button
              type="submit"
              className={styles.btnSuccess}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className={styles.spinner}></span>
                  Guardando...
                </>
              ) : (
                <>
                  <i className='bx bx-save'></i>
                  Guardar Usuario
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const FormField = ({ label, name, required, error, touched, children, fullWidth }) => (
  <div className={`${fullWidth ? 'full-width' : ''}`}>
    <label className="form-label">
      {label}
      {required && <span className="required">*</span>}
    </label>
    <div className="input-wrapper">
      {children}
      {error && touched && (
        <span className="error-text">{error}</span>
      )}
    </div>
  </div>
);

export default CreateUsuarioFormMultiStep;