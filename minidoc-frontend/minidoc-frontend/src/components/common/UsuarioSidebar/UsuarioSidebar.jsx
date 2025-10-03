// src/components/common/UsuarioSidebar/UsuarioSidebar.jsx
import React from 'react';
import MenuItem from '../Sidebar/MenuItem';
import { 
  USUARIO_SECTIONS, 
  USUARIO_CATEGORIES,
  getSectionsByCategory 
} from '../../../config/menus/usuarioSidebar.config';
import styles from './UsuarioSidebar.module.scss';

function UsuarioSidebar({ 
  activeSection = 'listado-general', 
  onSectionChange
}) {
  
  const handleSectionClick = (sectionId) => {
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  };

  return (
    <aside className={styles.sidebarSection}>
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3>Listado y Consultas</h3>
        </div>
        <div className={styles.sectionContent}>
          {USUARIO_CATEGORIES.map((category) => (
            <div key={category.id} className={styles.categoryGroup}>
              {/* Solo mostrar título de categoría si NO es "listado" */}
              {category.id !== 'listado' && (
                <div className={styles.categoryHeader}>
                  <i className={`bx ${category.icon}`}></i>
                  <h3>{category.label}</h3>
                </div>
              )}

              {/* Items de la categoría */}
              <div className={styles.categoryItems}>
                {getSectionsByCategory(category.id).map((section) => (
                  <MenuItem
                    key={section.id}
                    id={section.id}
                    icon={section.icon}
                    label={section.label}
                    isActive={activeSection === section.id}
                    onClick={handleSectionClick}
                    type="section"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default UsuarioSidebar;