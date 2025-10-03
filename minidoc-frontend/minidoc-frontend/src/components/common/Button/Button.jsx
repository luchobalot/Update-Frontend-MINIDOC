// src/components/common/Button/Button.jsx
import React from 'react';
import classNames from 'classnames';
import styles from './Button.module.scss';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
  onClick,
  className,
  ...props
}) => {
  
  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    
    if (onClick) {
      onClick(e);
    }
  };

  const buttonClasses = classNames(
    styles.btn,
    styles[`btn--${variant}`],
    styles[`btn--${size}`],
    {
      [styles['btn--loading']]: loading,
      [styles['btn--disabled']]: disabled,
      [styles['btn--full-width']]: fullWidth,
      [styles['btn--icon-right']]: iconPosition === 'right',
      [styles['btn--icon-only']]: icon && !children,
    },
    className
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={icon && !children ? 'Button' : undefined}
      {...props}
    >
      {loading && (
        <span className={styles.loadingSpinner} aria-hidden="true" />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      
      {!loading && children && (
        <span className={styles.text}>
          {children}
        </span>
      )}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  );
};

export default Button;