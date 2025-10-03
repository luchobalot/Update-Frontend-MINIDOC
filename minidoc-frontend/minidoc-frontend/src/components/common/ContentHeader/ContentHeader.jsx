// src/components/common/ContentHeader/ContentHeader.jsx
import React from 'react';
import styles from './ContentHeader.module.scss';

function ContentHeader({ 
  title, 
  description = null, 
  actions = [], // Array de botones
  loading = false,
  className = '',
  children = null // Para contenido personalizado adicional
}) {

  return (
    <div className={`${styles.contentHeader} ${className}`}>
      <div className={styles.titleSection}>
        <h2 className={styles.title}>{title}</h2>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
        {children && (
          <div className={styles.customContent}>
            {children}
          </div>
        )}
      </div>
      
      {actions.length > 0 && (
        <div className={styles.actionsSection}>
          {actions.map((action, index) => (
            <button
              key={action.id || index}
              className={`${styles.actionBtn} ${styles[action.variant] || styles.secondary}`}
              onClick={action.onClick}
              disabled={action.disabled || loading}
              title={action.tooltip}
            >
              {action.icon && (
                <i className={`bx ${action.icon}`}></i>
              )}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ContentHeader;