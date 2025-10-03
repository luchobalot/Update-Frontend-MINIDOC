// src/components/common/Sidebar/Sidebar.jsx
import React from 'react';
import MenuItem from './MenuItem';
import { 
  MAIN_SIDEBAR_SECTIONS, 
  MAIN_SIDEBAR_ACTIONS 
} from '../../../config/menus/mainSidebar.config';
import styles from './Sidebar.module.scss';

function Sidebar({ 
  activeSection = 'conocimiento', 
  activeAction = null,
  onSectionChange, 
  onActionClick,
  messageCounts = {}
}) {
  
  const handleSectionClick = (sectionId) => {
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  };

  const handleActionClick = (actionId) => {
    if (onActionClick) {
      onActionClick(actionId);
    }
  };

  return (
    <aside className={styles.sidebarSection}>
      {/* SECCIÓN: Mesa de Trabajo */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3>Mesa de Trabajo</h3>
        </div>
        <div className={styles.sectionContent}>
          {MAIN_SIDEBAR_SECTIONS.map((section) => (
            <MenuItem
              key={section.id}
              id={section.id}
              icon={section.icon}
              label={section.label}
              isActive={activeSection === section.id}
              onClick={handleSectionClick}
              type="section"
              count={messageCounts[section.id]}
            />
          ))}
        </div>

        {/* SECCIÓN: Acciones */}
        <div className={styles.sectionHeader}>
          <h3>Acciones</h3>
        </div>
        <div className={styles.sectionContent}>
          {MAIN_SIDEBAR_ACTIONS.map((action) => (
            <MenuItem
              key={action.id}
              id={action.id}
              icon={action.icon}
              label={action.label}
              isActive={activeAction === action.id}
              onClick={handleActionClick}
              type="action"
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;