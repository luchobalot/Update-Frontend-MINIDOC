// src/components/common/UsuarioDetailModal/UsuarioDetailModal.jsx
import React, { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';
import { usuarioService } from '../../../services/usuarioService';
import { useLookups } from '../../../hooks/useLookups';
import styles from './UsuarioDetailModal.module.scss';

const UsuarioDetailModal = ({ 
  isOpen = false, 
  onClose, 
  usuarioId = null 
}) => {
  const [usuarioData, setUsuarioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  
  const { getDetailById, getLookupById } = useLookups();

  useEffect(() => {
    if (isOpen && usuarioId) {
      setIsClosing(false);
      fetchUsuarioDetails();
    } else if (!isOpen) {
      setUsuarioData(null);
      setError(null);
    }
  }, [isOpen, usuarioId]);

  const fetchUsuarioDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await usuarioService.getById(usuarioId);
      
      if (result.success) {
        setUsuarioData(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error inesperado al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
      setIsClosing(false);
    }, 200);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const getLookupName = (lookupType, id, fallback = 'No especificado') => {
    if (!id) return fallback;
    const name = getDetailById(lookupType, id);
    return name || fallback;
  };

  const getLookup = (lookupType, id) => {
    if (!id) return null;
    return getLookupById(lookupType, id);
  };

  const InfoRow = ({ label, value, type = 'text' }) => {
    let displayValue = value;
    
    switch (type) {
      case 'boolean':
        displayValue = value ? 'Sí' : 'NO';
        break;
      default:
        displayValue = value || 'No especificado';
    }
    
    return (
      <div className={styles.infoRow}>
        <span className={styles.label}>{label}:</span>
        <span className={`${styles.value} ${type === 'boolean' ? styles.booleanValue : ''} ${value && type === 'boolean' ? styles.positive : styles.negative}`}>
          {displayValue}
        </span>
      </div>
    );
  };

  const renderLoading = () => (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <span>Cargando información del usuario...</span>
    </div>
  );

  const renderError = () => (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>⚠️</div>
      <div className={styles.errorContent}>
        <h3>Error al cargar los datos</h3>
        <p>{error}</p>
        <button 
          className={styles.retryButton}
          onClick={fetchUsuarioDetails}
        >
          Reintentar
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) return renderLoading();
    if (error) return renderError();
    if (!usuarioData) return null;

    const jerarquia = getLookup('jerarquias', usuarioData.jerarquiaId);
    const destino = getLookup('destinos', usuarioData.destinoId);
    const nivel = getLookup('niveles', usuarioData.nivelId);
    const cuerpo = getLookup('cuerpos', usuarioData.idCuerpo);
    const escalafon = getLookup('escalafones', usuarioData.idEscalafon);
    const tipoClasificacion = getLookup('tiposClasificacion', usuarioData.idTipoClasificacion);

    return (
      <div className={styles.contentGrid}>
        {/* SECCIÓN: Datos Personales */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <i className='bx bx-id-card'></i>
            Datos Personales
          </h3>
          <div className={styles.sectionContent}>
            <InfoRow 
              label="Matrícula de Revista" 
              value={usuarioData.matriculaRevista} 
            />
            <InfoRow 
              label="Apellido" 
              value={usuarioData.apellido} 
            />
            <InfoRow 
              label="Nombre" 
              value={usuarioData.nombre} 
            />
          </div>
        </div>

        {/* SECCIÓN: Información Militar */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <i className='bx bx-shield'></i>
            Información Militar
          </h3>
          <div className={styles.sectionContent}>
            <InfoRow 
              label="Jerarquía" 
              value={jerarquia ? `${jerarquia.letra || ''} - ${jerarquia.detalle || jerarquia.nombre || ''}`.trim() : getLookupName('jerarquias', usuarioData.jerarquiaId)}
            />
            <InfoRow 
              label="Destino" 
              value={destino ? `${destino.nombre || ''}${destino.cuatrigrama ? ` (${destino.cuatrigrama})` : ''}`.trim() : getLookupName('destinos', usuarioData.destinoId)}
            />
            {usuarioData.idEscalafon && (
              <InfoRow 
                label="Escalafón" 
                value={escalafon ? `${escalafon.letra || ''} - ${escalafon.detalle || escalafon.descripcion || ''}`.trim() : getLookupName('escalafones', usuarioData.idEscalafon)}
              />
            )}
            {usuarioData.idCuerpo && (
              <InfoRow 
                label="Cuerpo" 
                value={cuerpo ? `${cuerpo.sigla || ''} - ${cuerpo.detalle || cuerpo.descripcion || ''}`.trim() : getLookupName('cuerpos', usuarioData.idCuerpo)}
              />
            )}
          </div>
        </div>

        {/* SECCIÓN: Nivel y Permisos */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <i className='bx bx-layer'></i>
            Nivel y Permisos
          </h3>
          <div className={styles.sectionContent}>
            <InfoRow 
              label="Nivel" 
              value={nivel?.descripcion || nivel?.nombre || getLookupName('niveles', usuarioData.nivelId)}
            />
            <InfoRow 
              label="Tipo de Clasificación" 
              value={tipoClasificacion?.descripcion || tipoClasificacion?.nombre || getLookupName('tiposClasificacion', usuarioData.idTipoClasificacion)}
            />
            <InfoRow 
              label="Confianza" 
              value={usuarioData.confianza} 
              type="boolean" 
            />
            <InfoRow 
              label="Super Confianza" 
              value={usuarioData.superConfianza} 
              type="boolean" 
            />
          </div>
        </div>

        {/* SECCIÓN: Datos de Acceso e Información del Sistema */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <i className='bx bx-info-circle'></i>
            Datos de Acceso e Información del Sistema
          </h3>
          <div className={styles.sectionContent}>
            <InfoRow 
              label="Usuario" 
              value={usuarioData.logon} 
            />
            <InfoRow 
              label="Fecha de Creación" 
              value={usuarioData.fechaCreacion ? new Date(usuarioData.fechaCreacion).toLocaleString('es-AR') : 'No disponible'}
            />
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div 
      className={`${styles.modalOverlay} ${isClosing ? styles.closing : ''}`}
      onClick={handleOverlayClick}
    >
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <User size={24} />
            </div>
            <div className={styles.headerText}>
              <h2>
                {usuarioData ? 
                  `${usuarioData.apellido}, ${usuarioData.nombre}` : 
                  'Cargando...'
                }
              </h2>
              {usuarioData && (
                <span className={styles.headerSubtitle}>
                  Usuario: {usuarioData.logon} | MR: {usuarioData.matriculaRevista}
                </span>
              )}
            </div>
          </div>
          <button 
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default UsuarioDetailModal;