// src/components/common/UsuarioTable/UsuarioTable.jsx
import React, { useState, useMemo } from 'react';
import { Eye, Edit, Trash2, ChevronUp, ChevronDown, Search } from 'lucide-react';
import { useLookups } from '../../../hooks/useLookups';
import styles from './UsuarioTable.module.scss';

function UsuarioTable({ 
  data = [], 
  loading = false, 
  error = null,
  onView = null,
  onEdit = null,
  onDelete = null,
  onRefresh = null
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');

  // Hook para obtener nombres de lookups
  const { getDetailById } = useLookups();

  // Función para obtener el nombre de la jerarquía
  const getJerarquiaName = (usuario) => {
    if (usuario.jerarquia?.nombre) {
      return usuario.jerarquia.nombre;
    }
    if (usuario.jerarquia?.iniciales) {
      return usuario.jerarquia.iniciales;
    }
    if (usuario.jerarquiaId) {
      return getDetailById('jerarquias', usuario.jerarquiaId) || `ID: ${usuario.jerarquiaId}`;
    }
    return 'Sin Información';
  };

  // Función para obtener el nombre del destino
  const getDestinoName = (usuario) => {
    if (usuario.destino?.nombre) {
      return usuario.destino.nombre;
    }
    if (usuario.destinoId) {
      return getDetailById('destinos', usuario.destinoId) || `ID: ${usuario.destinoId}`;
    }
    return 'Sin Información';
  };

  // Función para manejar ordenamiento
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Función para manejar búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    setActiveSearchTerm(searchTerm.trim());
  };

  // Función para limpiar búsqueda
  const handleClear = () => {
    setSearchTerm('');
    setActiveSearchTerm('');
  };

  // Datos filtrados por búsqueda
  const filteredData = useMemo(() => {
    if (!activeSearchTerm) return data;
    
    const searchLower = activeSearchTerm.toLowerCase();
    
    return data.filter(usuario => {
      const jerarquiaName = getJerarquiaName(usuario).toLowerCase();
      const destinoName = getDestinoName(usuario).toLowerCase();
      const userName = (usuario.logon || usuario.userName || '').toLowerCase();
      
      return (
        usuario.matriculaRevista?.toString().toLowerCase().includes(searchLower) ||
        usuario.apellido?.toLowerCase().includes(searchLower) ||
        usuario.nombre?.toLowerCase().includes(searchLower) ||
        userName.includes(searchLower) ||
        jerarquiaName.includes(searchLower) ||
        destinoName.includes(searchLower)
      );
    });
  }, [data, activeSearchTerm]);

  // Datos ordenados
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      // Manejar casos especiales para ordenamiento
      if (sortConfig.key === 'apellido') {
        aVal = a.apellido || '';
        bVal = b.apellido || '';
      }

      if (sortConfig.key === 'nombre') {
        aVal = a.nombre || '';
        bVal = b.nombre || '';
      }

      if (sortConfig.key === 'matriculaRevista') {
        aVal = a.matriculaRevista || '';
        bVal = b.matriculaRevista || '';
      }

      if (sortConfig.key === 'userName') {
        aVal = a.logon || a.userName || '';
        bVal = b.logon || b.userName || '';
      }

      if (sortConfig.key === 'jerarquia') {
        aVal = getJerarquiaName(a);
        bVal = getJerarquiaName(b);
      }

      if (sortConfig.key === 'destino') {
        aVal = getDestinoName(a);
        bVal = getDestinoName(b);
      }

      // Convertir a string para comparación segura
      aVal = String(aVal);
      bVal = String(bVal);

      // Ordenamiento
      if (aVal < bVal) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Componente de header con ordenamiento
  const SortableHeader = ({ sortKey, children, className = '' }) => (
    <th 
      className={`${styles.sortableHeader} ${className}`}
      onClick={() => handleSort(sortKey)}
    >
      <div className={styles.headerContent}>
        <span>{children}</span>
        {sortConfig.key === sortKey && (
          <span className={styles.sortIcon}>
            {sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        )}
      </div>
    </th>
  );

  // Estados de loading
  if (loading) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <span>Cargando usuarios...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      {/* HEADER DE BÚSQUEDA */}
      <div className={styles.searchHeader}>
        <div className={styles.searchSection}>
          <div className={styles.searchTitle}>
            <Search size={16} />
            Búsqueda:
          </div>
          
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <div className={styles.searchInputWrapper}>
              <input 
                type="text" 
                className={styles.searchInput}
                placeholder="Buscar por MR, apellido, nombre, usuario, jerarquía o destino..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className={styles.searchButtons}>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                <Search size={14} />
                Buscar
              </button>
              <button 
                type="button" 
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={handleClear}
              >
                <Trash2 size={14} />
                Limpiar
              </button>
            </div>
          </form>
        </div>
        
        <div className={styles.resultsInfo}>
          Mostrando <span className={styles.resultsHighlight}>{sortedData.length}</span> de <span className={styles.resultsHighlight}>{data.length}</span> resultados
          {activeSearchTerm && (
            <div style={{fontSize: '12px', marginTop: '2px'}}>
              Búsqueda: "{activeSearchTerm}"
            </div>
          )}
        </div>
      </div>

      {/* MENSAJE DE ERROR (SI HAY) */}
      {error && (
        <div className={styles.errorBanner}>
          <div className={styles.errorContent}>
            <div className={styles.errorIcon}>
              <i className='bx bx-error-circle'></i>
            </div>
            <div className={styles.errorText}>
              <h4>Error de Conexión</h4>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* CONTENEDOR DE LA TABLA */}
      <div className={styles.tableWrapper}>
        {!data || data.length === 0 ? (
          <div className={styles.emptyState}>
            <i className='bx bx-inbox'></i>
            <span>No hay usuarios registrados</span>
          </div>
        ) : sortedData.length === 0 ? (
          <div className={styles.emptyState}>
            <i className='bx bx-search-alt'></i>
            <span>No se encontraron resultados para "{activeSearchTerm}"</span>
          </div>
        ) : (
          <table className={styles.usuarioTable}>
            <thead>
              <tr>
                <SortableHeader sortKey="matriculaRevista" className={styles.colMr}>
                  MR
                </SortableHeader>
                <SortableHeader sortKey="apellido" className={styles.colApellido}>
                  Apellido
                </SortableHeader>
                <SortableHeader sortKey="nombre" className={styles.colNombre}>
                  Nombre
                </SortableHeader>
                <SortableHeader sortKey="userName" className={styles.colUsuario}>
                  Usuario
                </SortableHeader>
                <SortableHeader sortKey="jerarquia" className={styles.colJerarquia}>
                  Jerarquía
                </SortableHeader>
                <SortableHeader sortKey="destino" className={styles.colDestino}>
                  Destino
                </SortableHeader>
                <th className={styles.colAcciones}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((usuario) => (
                <tr key={usuario.id || usuario.idUsuarioMinidoc} className={styles.tableRow}>
                  <td className={styles.colMr}>
                    <span className={styles.mrBadge}>
                      {usuario.matriculaRevista || 'N/A'}
                    </span>
                  </td>
                  <td className={styles.colApellido}>
                    <span className={styles.apellidoText}>
                      {usuario.apellido || 'N/A'}
                    </span>
                  </td>
                  <td className={styles.colNombre}>
                    <span className={styles.nombreText}>
                      {usuario.nombre || 'N/A'}
                    </span>
                  </td>
                  <td className={styles.colUsuario}>
                    <span className={styles.usuarioText}>
                      {usuario.logon || usuario.userName || 'N/A'}
                    </span>
                  </td>
                  <td className={styles.colJerarquia}>
                    <span className={styles.jerarquiaText}>
                      {getJerarquiaName(usuario)}
                    </span>
                  </td>
                  <td className={styles.colDestino}>
                    <span className={styles.destinoText}>
                      {getDestinoName(usuario)}
                    </span>
                  </td>
                  <td className={styles.colAcciones}>
                    <div className={styles.actionsGroup}>
                      {onView && (
                        <button
                          className={`${styles.actionBtn} ${styles.viewBtn}`}
                          onClick={() => onView(usuario)}
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          className={`${styles.actionBtn} ${styles.editBtn}`}
                          onClick={() => onEdit(usuario)}
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          onClick={() => onDelete(usuario)}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* FOOTER DE LA TABLA */}
      <div className={styles.tableFooter}>
        <span className={styles.resultsCount}>
          Total de registros{activeSearchTerm ? ' filtrados' : ''}: {sortedData.length}
        </span>
      </div>
    </div>
  );
}

export default UsuarioTable;