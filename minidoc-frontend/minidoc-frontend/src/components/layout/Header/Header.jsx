// src/components/layout/Header/Header.jsx
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import Button from "../../common/Button"; // IMPORTAR EL COMPONENTE
import { ArrowLeft } from "lucide-react";
import classNames from "classnames";

const Header = ({
  title = "",
  showBackButton = false,
  backTo = "/",
  actions = [],
  breadcrumb = [],
  variant = "default",
  loading = false,
  className,
  ...props
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(backTo);
  };

  const headerClasses = classNames(
    styles.header,
    {
      [styles.withBreadcrumb]: variant === "withBreadcrumb" || breadcrumb.length > 0,
      [styles.compact]: variant === "compact",
      [styles.loading]: loading,
    },
    className
  );

  return (
    <header className={headerClasses} {...props}>
      <div className={styles.container}>
        {/* Botón volver (lado izquierdo) - USAR BUTTON COMPONENT */}
        {showBackButton && (
          <Button
            variant="secondary"
            icon={<ArrowLeft />}
            onClick={handleGoBack}
            className={styles.backButton}
          >
            Volver
          </Button>
        )}

        {/* Breadcrumb (centro) */}
        {breadcrumb.length > 0 && (
          <nav className={styles.breadcrumb}>
            {breadcrumb.map((item, index) => (
              <span key={index}>
                <a
                  href={item.href || "#"}
                  className={classNames(styles.breadcrumbItem, {
                    [styles.active]: index === breadcrumb.length - 1,
                  })}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                  }}
                >
                  {item.label}
                </a>
                {index < breadcrumb.length - 1 && (
                  <span className={styles.separator}>›</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Título (lado derecho) */}
        {title && (
          <div className={styles.title}>
            <h1>{title}</h1>
          </div>
        )}

        {/* Acciones adicionales - TAMBIÉN PUEDES USAR BUTTON COMPONENT */}
        <div className={styles.actions}>
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'secondary'}
              size={action.size || 'md'}
              icon={action.icon}
              onClick={action.onClick}
              disabled={action.disabled}
              className={styles.actionButton} // MANTENER PARA SPACING
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;