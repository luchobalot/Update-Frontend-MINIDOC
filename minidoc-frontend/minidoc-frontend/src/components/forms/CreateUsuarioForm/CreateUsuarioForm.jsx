// src/components/forms/CreateUsuarioForm/CreateUsuarioForm.jsx
import React, { useState } from 'react';
import Button from '../../common/Button';
import { useLookups } from '../../../hooks/useLookups';
import styles from './CreateUsuarioForm.module.scss';

const FormField = ({ 
  label, 
  name, 
  children, 
  required = false,
  errors,
  touched
}) => (
  <div className={styles.formGroup}>
    <label className={styles.formLabel}>
      {label}
      {required && <span className={styles.required}>*</span>}
    </label>
    <div className={styles.inputWrapper}>
      {children}
      {errors[name] && touched[name] && (
        <span className={styles.errorText}>{errors[name]}</span>
      )}
    </div>
  </div>
);

const SelectField = ({ 
  name, 
  options = [], 
  placeholder = "Seleccionar...",
  value,
  onChange,
  onBlur,
  errors,
  touched,
  styles: componentStyles,
  getOptionId,
  getOptionText,
}) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`${componentStyles.formInput} ${errors[name] && touched[name] ? componentStyles.inputError : ''}`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={getOptionId(option)} value={getOptionId(option)}>
          {getOptionText(option)}
        </option>
      ))}
    </select>
  );
};

const CreateUsuarioForm = ({ 
  onSubmit, 
  onCancel, 
  loading = false,
  initialData = null
}) => {
  
  const { lookups, loading: lookupsLoading, error: lookupsError, refresh } = useLookups();
  
  const [formData, setFormData] = useState({
    userName: initialData?.userName || '',
    password: '',
    passwordConfirmation: '',
    matriculaRevista: initialData?.matriculaRevista || '',
    apellido: initialData?.apellido || '',
    nombre: initialData?.nombre || '',
    jerarquiaId: initialData?.jerarquiaId || '',
    destinoId: initialData?.destinoId || '',
    nivelId: initialData?.nivelId || '',
    alcanceId: initialData?.alcanceId || '',
    idEscalafon: initialData?.idEscalafon || '',
    idCuerpo: initialData?.idCuerpo || '',
    confianza: initialData?.confianza || false,
    superConfianza: initialData?.superConfianza || false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'userName':
        if (!value?.trim()) return 'El nombre de usuario es obligatorio';
        if (value.length < 3) return 'Debe tener al menos 3 caracteres';
        if (value.length > 100) return 'No puede exceder 100 caracteres';
        return '';
      
      case 'password':
        if (!initialData && !value) return 'La contraseña es obligatoria';
        if (value && value.length < 6) return 'Debe tener al menos 6 caracteres';
        return '';
      
      case 'passwordConfirmation':
        if (!initialData && !value) return 'Debe confirmar la contraseña';
        if (value !== formData.password) return 'Las contraseñas no coinciden';
        return '';
      
      case 'matriculaRevista':
        if (!/^\d{7}$/.test(value)) return 'Debe tener exactamente 7 dígitos';
        return '';
      
      case 'apellido':
        if (!value?.trim()) return 'El apellido es obligatorio';
        return '';
      
      case 'nombre':
        if (!value?.trim()) return 'El nombre es obligatorio';
        return '';
      
      case 'jerarquiaId':
      case 'destinoId':
      case 'nivelId':
      case 'alcanceId':
        if (!value) return 'Campo obligatorio';
        return '';
      
      default:
        return '';
    }
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
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'userName', 
      'password', 
      'passwordConfirmation',
      'matriculaRevista', 
      'apellido', 
      'nombre', 
      'jerarquiaId', 
      'destinoId', 
      'nivelId', 
      'alcanceId'
    ];
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    setTouched(
      requiredFields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
    );

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log('Formulario con errores:', errors);
      return;
    }

    const dataToSubmit = {
      logon: formData.userName.trim(),
      password: formData.password,
      passwordConfirmation: formData.passwordConfirmation,
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      matriculaRevista: formData.matriculaRevista,
      jerarquiaId: parseInt(formData.jerarquiaId, 10),
      destinoId: parseInt(formData.destinoId, 10),
      nivelId: parseInt(formData.nivelId, 10),
      alcanceId: parseInt(formData.alcanceId, 10),
      idEscalafon: formData.idEscalafon ? parseInt(formData.idEscalafon, 10) : null,
      idCuerpo: formData.idCuerpo ? parseInt(formData.idCuerpo, 10) : null,
      confianza: Boolean(formData.confianza),
      superConfianza: Boolean(formData.superConfianza),
    };

    console.log('Datos a enviar:', dataToSubmit);

    if (onSubmit) {
      onSubmit(dataToSubmit);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  if (lookupsLoading) {
    return (
      <div className={styles.formContainer}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <span>Cargando datos del formulario...</span>
        </div>
      </div>
    );
  }

  if (lookupsError) {
    return (
      <div className={styles.formContainer}>
        <div className={styles.errorState}>
          <i className='bx bx-error-circle'></i>
          <h3>Error al cargar datos</h3>
          <p>{lookupsError}</p>
          <Button variant="primary" onClick={refresh} icon={<i className='bx bx-refresh'></i>}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h2>
          <i className='bx bx-user-plus'></i>
          {initialData ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.formContent}>
        <div className={styles.formGrid}>
          
          {/* Datos Personales */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Datos Personales</h3>
            
            <FormField label="Matrícula de Revista (7 dígitos)" name="matriculaRevista" required errors={errors} touched={touched}>
              <input
                type="text"
                name="matriculaRevista"
                value={formData.matriculaRevista}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ingrese MR (7 dígitos)"
                className={`${styles.formInput} ${errors.matriculaRevista && touched.matriculaRevista ? styles.inputError : ''}`}
                disabled={loading}
                maxLength={7}
              />
            </FormField>

            <FormField label="Apellido" name="apellido" required errors={errors} touched={touched}>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ingrese apellido"
                className={`${styles.formInput} ${errors.apellido && touched.apellido ? styles.inputError : ''}`}
                disabled={loading}
                maxLength={50}
              />
            </FormField>

            <FormField label="Nombre" name="nombre" required errors={errors} touched={touched}>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ingrese nombre"
                className={`${styles.formInput} ${errors.nombre && touched.nombre ? styles.inputError : ''}`}
                disabled={loading}
                maxLength={50}
              />
            </FormField>
          </div>

          {/* Información Militar */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Información Militar</h3>
            
            <FormField label="Jerarquía" name="jerarquiaId" required errors={errors} touched={touched}>
              <SelectField
                name="jerarquiaId"
                options={lookups.jerarquias || []}
                placeholder="Seleccionar jerarquía"
                disabled={loading}
                required
                value={formData.jerarquiaId}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
                styles={styles}
                getOptionId={(option) => option.id}
                getOptionText={(option) => option.nombre}
              />
            </FormField>

            <FormField label="Destino" name="destinoId" required errors={errors} touched={touched}>
              <SelectField
                name="destinoId"
                options={lookups.destinos || []}
                placeholder="Seleccionar destino"
                disabled={loading}
                required
                value={formData.destinoId}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
                styles={styles}
                getOptionId={(option) => option.id}
                getOptionText={(option) => option.nombre}
              />
            </FormField>

            <FormField label="Cuerpo" name="idCuerpo" errors={errors} touched={touched}>
              <SelectField
                name="idCuerpo"
                options={lookups.cuerpos || []}
                placeholder="Seleccionar cuerpo"
                disabled={loading}
                value={formData.idCuerpo}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
                styles={styles}
                getOptionId={(option) => option.id}
                getOptionText={(option) => option.descripcion}
              />
            </FormField>

            <FormField label="Escalafón" name="idEscalafon" errors={errors} touched={touched}>
              <SelectField
                name="idEscalafon"
                options={lookups.escalafones || []}
                placeholder="Seleccionar escalafón"
                disabled={loading}
                value={formData.idEscalafon}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
                styles={styles}
                getOptionId={(option) => option.id}
                getOptionText={(option) => option.descripcion}
              />
            </FormField>
          </div>

          {/* Clasificación y Permisos */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Clasificación y Permisos</h3>
            
            <FormField label="Nivel" name="nivelId" required errors={errors} touched={touched}>
              <SelectField
                name="nivelId"
                options={lookups.niveles || []}
                placeholder="Seleccionar nivel"
                disabled={loading}
                required
                value={formData.nivelId}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
                styles={styles}
                getOptionId={(option) => option.id}
                getOptionText={(option) => option.nombre}
              />
            </FormField>

            <FormField label="Alcance" name="alcanceId" required errors={errors} touched={touched}>
              <SelectField
                name="alcanceId"
                options={lookups.alcances || []}
                placeholder="Seleccionar alcance"
                disabled={loading}
                required
                value={formData.alcanceId}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
                styles={styles}
                getOptionId={(option) => option.id}
                getOptionText={(option) => option.nombre}
              />
            </FormField>

            <FormField label="Permisos Especiales" name="permisos" errors={errors} touched={touched}>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    name="confianza"
                    checked={formData.confianza}
                    onChange={handleChange}
                    className={styles.checkboxInput}
                    disabled={loading}
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
                    disabled={loading}
                  />
                  <span className={styles.checkboxLabel}>Super Confianza</span>
                </label>
              </div>
            </FormField>
          </div>

          {/* Datos de Acceso */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Datos de Acceso</h3>
            
            <FormField label="Usuario" name="userName" required errors={errors} touched={touched}>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ingrese nombre de usuario"
                className={`${styles.formInput} ${errors.userName && touched.userName ? styles.inputError : ''}`}
                disabled={loading}
                maxLength={100}
              />
            </FormField>

            {!initialData && (
              <>
                <FormField label="Contraseña" name="password" required errors={errors} touched={touched}>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ingrese contraseña"
                    className={`${styles.formInput} ${errors.password && touched.password ? styles.inputError : ''}`}
                    disabled={loading}
                    maxLength={50}
                  />
                </FormField>

                <FormField label="Confirmar Contraseña" name="passwordConfirmation" required errors={errors} touched={touched}>
                  <input
                    type="password"
                    name="passwordConfirmation"
                    value={formData.passwordConfirmation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Confirme la contraseña"
                    className={`${styles.formInput} ${errors.passwordConfirmation && touched.passwordConfirmation ? styles.inputError : ''}`}
                    disabled={loading}
                    maxLength={50}
                  />
                </FormField>
              </>
            )}
          </div>
        </div>

        <div className={styles.formActions}>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={loading}
            icon={<i className='bx bx-x'></i>}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={<i className='bx bx-save'></i>}
          >
            {loading ? 'Guardando...' : (initialData ? 'Actualizar' : 'Guardar Usuario')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateUsuarioForm;
