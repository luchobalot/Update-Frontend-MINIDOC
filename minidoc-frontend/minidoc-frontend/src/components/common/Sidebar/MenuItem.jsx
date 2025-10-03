import React from 'react';

function MenuItem({ 
  id, 
  icon, 
  label, 
  isActive = false, 
  onClick, 
  type = 'section',
  count = null
}) {
  
  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // Construir className de forma explícita
  const fullClassName = `menu-item${isActive ? ' active' : ''}`;

  return (
    <div 
      className={fullClassName}
      data-section={type === 'section' ? id : undefined}
      data-action={type === 'action' ? id : undefined}
      data-active={isActive} // Para CSS selector adicional
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <i className={`bx ${icon}`}></i>
      <span>{label}</span>
      
      {count !== null && count > 0 && (
        <span className="menu-item-count">{count}</span>
      )}
    </div>
  );
}

export default MenuItem;