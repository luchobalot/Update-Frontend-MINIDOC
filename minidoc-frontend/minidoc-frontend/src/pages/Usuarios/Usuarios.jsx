// src/pages/Usuarios/Usuarios.jsx
import React, { useState } from 'react';
import UsuarioTable from '../../components/common/UsuarioTable';
import UsuarioSidebar from '../../components/common/UsuarioSidebar';
import ContentHeader from '../../components/common/ContentHeader';
import Header from '../../components/layout/Header';
import UsuarioDetailModal from '../../components/common/UsuarioDetailModal';
import CreateUsuarioForm from '../../components/forms/CreateUsuarioForm';
import { useUsuarios } from '../../hooks/useUsuarios';
import { usuarioService } from '../../services/usuarioService';
import styles from './Usuarios.module.scss';

function Usuarios() {
  const { data, loading, error, refresh } = useUsuarios();
  const [activeSection, setActiveSection] = useState('listado-general');
  
  // Estado del modal
  const [modalState, setModalState] = useState({
    isOpen: false,
    usuarioId: null
  });

  // Estado para el formulario
  const [formLoading, setFormLoading] = useState(false);

  const handleView = (usuario) => {
    console.log('Abriendo modal para:', usuario);
    setModalState({
      isOpen: true,
      usuarioId: usuario.id
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      usuarioId: null
    });
  };

  const handleEdit = (usuario) => {
    console.log('Editar:', usuario);
    alert(`Editar: ${usuario.nombre} ${usuario.apellido}`);
  };

  const handleDelete = async (usuario) => {
    console.log('Eliminar:', usuario);
    if (window.confirm(`¿Está seguro que desea eliminar a ${usuario.nombre} ${usuario.apellido}?`)) {
      setFormLoading(true);
      
      try {
        const result = await usuarioService.delete(usuario.id);
        
        if (result.success) {
          alert('Usuario eliminado exitosamente');
          refresh();
        } else {
          alert(`Error al eliminar usuario:\n${result.error}`);
        }
      } catch (error) {
        console.error('Error inesperado:', error);
        alert('Error inesperado al eliminar el usuario. Intente nuevamente.');
      } finally {
        setFormLoading(false);
      }
    }
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    console.log('Sección seleccionada:', sectionId);
  };

  // Manejar creación de usuario
  const handleCreateUsuario = async (usuarioData) => {
    console.log('Creando usuario:', usuarioData);
    setFormLoading(true);
    
    try {
      const result = await usuarioService.create(usuarioData);
      
      if (result.success) {
        console.log('Usuario creado exitosamente:', result.data);
        
        // Mostrar mensaje de éxito
        alert(`Usuario creado exitosamente:\n${usuarioData.nombre} ${usuarioData.apellido} (Username: ${usuarioData.logon})`);
        
        // Volver al listado
        setActiveSection('listado-general');
        
        // Recargar la lista
        refresh();
      } else {
        console.error('Error al crear usuario:', result.error);
        alert(`Error al crear usuario:\n${result.error}`);
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      alert('Error inesperado al crear el usuario. Intente nuevamente.');
    } finally {
      setFormLoading(false);
    }
  };

  // Manejar cancelación del formulario
  const handleCancelForm = () => {
    console.log('Cancelando formulario...');
    setActiveSection('listado-general');
  };

  const getHeaderConfig = () => {
    switch (activeSection) {
      case 'listado-general':
        return {
          title: 'Listado General de Usuarios',
          description: 'Consulta y gestión de usuarios del sistema',
          actions: [
            {
              label: 'Nuevo Usuario',
              icon: 'bx-plus',
              variant: 'primary',
              onClick: () => setActiveSection('agregar-usuario')
            },
            {
              label: 'Actualizar',
              icon: 'bx-refresh',
              variant: 'secondary',
              onClick: refresh
            }
          ]
        };
        
      case 'busqueda-avanzada':
        return {
          title: 'Búsqueda Avanzada',
          description: 'Filtros y búsqueda detallada de usuarios',
          actions: [
            {
              label: 'Buscar',
              icon: 'bx-search',
              variant: 'primary',
              onClick: () => alert('Buscar próximamente...')
            },
            {
              label: 'Limpiar Filtros',
              icon: 'bx-x',
              variant: 'secondary',
              onClick: () => alert('Limpiar filtros próximamente...')
            }
          ]
        };
        
      case 'agregar-usuario':
        return {
          title: 'Agregar Nuevo Usuario',
          description: 'Complete la información del usuario',
        };

      case 'modificar-usuario':
        return {
          title: 'Modificar Usuario',
          description: 'Edición de datos de usuario'
        };

      case 'otorgar-permisos':
        return {
          title: 'Otorgar Permisos',
          description: 'Gestión de permisos y accesos de usuarios'
        };

      case 'control-accesos':
        return {
          title: 'Control de Accesos',
          description: 'Monitoreo de accesos al sistema'
        };

      case 'usuarios-nivel':
        return {
          title: 'Usuarios por Nivel',
          description: 'Consulta de usuarios agrupados por nivel de acceso'
        };

      case 'estructura-jerarquica':
        return {
          title: 'Estructura Jerárquica',
          description: 'Visualización de la estructura organizacional'
        };
        
      default:
        return {
          title: 'Gestión de Usuarios',
          description: 'Selecciona una opción del menú lateral'
        };
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'listado-general':
        return (
          <UsuarioTable
            data={data}
            loading={loading}
            error={error}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefresh={refresh}
          />
        );
      
      case 'busqueda-avanzada':
        return (
          <div className={styles.placeholderContent}>
            <h3>Búsqueda Avanzada</h3>
            <p>Funcionalidad de búsqueda avanzada próximamente...</p>
          </div>
        );
      
      case 'agregar-usuario':
        return (
          <CreateUsuarioForm
            onSubmit={handleCreateUsuario}
            onCancel={handleCancelForm}
            loading={formLoading}
          />
        );

      case 'modificar-usuario':
        return (
          <div className={styles.placeholderContent}>
            <h3>Modificar Usuario</h3>
            <p>Funcionalidad de modificación próximamente...</p>
          </div>
        );

      case 'otorgar-permisos':
        return (
          <div className={styles.placeholderContent}>
            <h3>Otorgar Permisos</h3>
            <p>Funcionalidad de permisos próximamente...</p>
          </div>
        );

      case 'control-accesos':
        return (
          <div className={styles.placeholderContent}>
            <h3>Control de Accesos</h3>
            <p>Funcionalidad de control próximamente...</p>
          </div>
        );

      case 'usuarios-nivel':
        return (
          <div className={styles.placeholderContent}>
            <h3>Usuarios por Nivel</h3>
            <p>Funcionalidad de consulta por nivel próximamente...</p>
          </div>
        );

      case 'estructura-jerarquica':
        return (
          <div className={styles.placeholderContent}>
            <h3>Estructura Jerárquica</h3>
            <p>Funcionalidad de estructura próximamente...</p>
          </div>
        );
      
      default:
        return (
          <UsuarioTable
            data={data}
            loading={loading}
            error={error}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefresh={refresh}
          />
        );
    }
  };

  const headerConfig = getHeaderConfig();

  return (
    <div className={styles.usuariosContainer}>
      <Header
        title="MINIDOC - Gestión de Usuarios"
        showBackButton={true}
        backTo="/mesa-trabajo"
      />
      
      <div className={styles.contentWrapper}>
        <UsuarioSidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />

        <div className={styles.contentArea}>
          {activeSection !== 'agregar-usuario' && (
            <ContentHeader
              title={headerConfig.title}
              description={headerConfig.description}
              actions={headerConfig.actions}
              loading={loading}
            />
          )}
          
          {renderContent()}
        </div>
      </div>

      {/* Modal de detalles */}
      <UsuarioDetailModal
        isOpen={modalState.isOpen}
        usuarioId={modalState.usuarioId}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default Usuarios;