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
  
  // Hook para obtener nombres de lookups
  const { getDetailById, getLookupById } = useLookups();

  // Fetch data cuando se abre el modal
  useEffect(() => {
    if (isOpen && usuarioId) {
      fetchUsuarioDetails();
    } else {
      // Limpiar datos cuando se cierra
      setUsuarioData(null);
      setError(null);
    }
  }, [isOpen, usuarioId]);

  // Fetch detalles del usuario
  const fetchUsuarioDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`📥 Cargando detalles para Usuario ID: ${usuarioId}`);
      
      const result = await usuarioService.getById(usuarioId);
      
      if (result.success) {
        setUsuarioData(result.data);
        console.log('✅ Datos del usuario cargados:', result.data);
      } else {
        setError(result.error);
        console.error('❌ Error:', result.error);
      }
    } catch (err) {
      setError('Error inesperado al cargar los datos');
      console.error('❌ Error inesperado:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cerrar modal
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Manejar tecla ESC
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

  // Click en overlay para cerrar
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Obtener nombre del lookup por ID
  const getLookupName = (lookupType, id, fallback = 'No especificado') => {
    if (!id) return fallback;
    const name = getDetailById(lookupType, id);
    return name || fallback;
  };

  // Obtener lookup completo
  const getLookup = (lookupType, id) => {
    if (!id) return null;
    return getLookupById(lookupType, id);
  };

  // Renderizar información con formato mejorado
  const InfoRow = ({ label, value, type = 'text' }) => {
    let displayValue = value;
    
    // Formatear según el tipo
    switch (type) {
      case 'boolean':
        displayValue = value ? 'SÍ' : 'NO';
        break;
      case 'id':
        displayValue = value || 'N/A';
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

  // Estado de carga
  const renderLoading = () => (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <span>Cargando información del usuario...</span>
    </div>
  );

  // Estado de error
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

  // Contenido principal del modal
  const renderContent = () => {
    if (loading) return renderLoading();
    if (error) return renderError();
    if (!usuarioData) return null;

    // Obtener información de lookups
    const jerarquia = getLookup('jerarquias', usuarioData.jerarquiaId);
    const destino = getLookup('destinos', usuarioData.destinoId);
    const nivel = getLookup('niveles', usuarioData.nivelId);
    const alcance = getLookup('alcances', usuarioData.alcanceId);
    const cuerpo = getLookup('cuerpos', usuarioData.idCuerpo);
    const escalafon = getLookup('escalafones', usuarioData.idEscalafon);

    return (
      <div className={styles.contentGrid}>
        {/* SECCIÓN: Datos de Acceso */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <i className='bx bx-user-circle'></i>
            Datos de Acceso
          </h3>
          <div className={styles.sectionContent}>
            <InfoRow 
              label="Usuario (Logon)" 
              value={usuarioData.userName || usuarioData.logon} 
            />
            <InfoRow 
              label="ID Usuario" 
              value={usuarioData.id || usuarioData.idUsuarioMinidoc}
              type="id"
            />
          </div>
        </div>

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
              value={jerarquia ? `${jerarquia.nombre}${jerarquia.iniciales ? ` (${jerarquia.iniciales})` : ''}` : getLookupName('jerarquias', usuarioData.jerarquiaId)}
            />
            <InfoRow 
              label="Destino" 
              value={destino ? `${destino.nombre}${destino.cuatrigrama ? ` (${destino.cuatrigrama})` : ''}` : getLookupName('destinos', usuarioData.destinoId)}
            />
          </div>
        </div>

        {/* SECCIÓN: Cuerpo y Escalafón (solo si existen) */}
        {(usuarioData.idCuerpo || usuarioData.idEscalafon) && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <i className='bx bx-briefcase'></i>
              Especialización
            </h3>
            <div className={styles.sectionContent}>
              {usuarioData.idCuerpo && (
                <InfoRow 
                  label="Cuerpo" 
                  value={cuerpo?.descripcion || getLookupName('cuerpos', usuarioData.idCuerpo)}
                />
              )}
              {usuarioData.idEscalafon && (
                <InfoRow 
                  label="Escalafón" 
                  value={escalafon ? `${escalafon.letra || ''} ${escalafon.descripcion || ''}`.trim() : getLookupName('escalafones', usuarioData.idEscalafon)}
                />
              )}
            </div>
          </div>
        )}

        {/* SECCIÓN: Nivel y Alcance */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <i className='bx bx-layer'></i>
            Nivel y Alcance
          </h3>
          <div className={styles.sectionContent}>
            <InfoRow 
              label="Nivel" 
              value={nivel?.nombre || getLookupName('niveles', usuarioData.nivelId)}
            />
            <InfoRow 
              label="Alcance" 
              value={alcance?.nombre || getLookupName('alcances', usuarioData.alcanceId)}
            />
          </div>
        </div>

        {/* SECCIÓN: Permisos Especiales */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <i className='bx bx-lock-alt'></i>
            Permisos Especiales
          </h3>
          <div className={styles.sectionContent}>
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
      </div>
    );
  };

  // No renderizar nada si no está abierto
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContainer}>
        {/* Header del Modal */}
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
                  Usuario: {usuarioData.userName || usuarioData.logon} | MR: {usuarioData.matriculaRevista}
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

        {/* Body del Modal */}
        <div className={styles.modalBody}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default UsuarioDetailModal;