// src/config/menus/usuarioSidebar.config.js

/**
 * Configuración del menú lateral de Usuarios
 * Este menú se muestra en el módulo de gestión de usuarios
 */

export const USUARIO_CATEGORIES = [
  {
    id: 'listado',
    label: 'Listado y Consultas',
    icon: 'bx-list-ul',
    order: 1
  },
  {
    id: 'gestion',
    label: 'Gestión',
    icon: 'bx-cog',
    order: 2
  },
  {
    id: 'permisos',
    label: 'Permisos y Accesos',
    icon: 'bx-lock-alt',
    order: 3
  },
  {
    id: 'organizacion',
    label: 'Organización',
    icon: 'bx-sitemap',
    order: 4
  }
];

export const USUARIO_SECTIONS = [
  // Listado y Consultas
  {
    id: 'listado-general',
    icon: 'bx-group',
    label: 'Listado General',
    category: 'listado',
    order: 1,
    implemented: true,
    description: 'Ver todos los usuarios del sistema'
  },
  {
    id: 'busqueda-avanzada',
    icon: 'bx-search',
    label: 'Búsqueda Avanzada',
    category: 'listado',
    order: 2,
    implemented: false,
    description: 'Búsqueda con filtros múltiples'
  },

  // Gestión
  {
    id: 'agregar-usuario',
    icon: 'bx-user-plus',
    label: 'Agregar Usuario',
    category: 'gestion',
    order: 1,
    implemented: true,
    description: 'Crear un nuevo usuario en el sistema'
  },
  {
    id: 'modificar-usuario',
    icon: 'bx-edit-alt',
    label: 'Modificar Usuario',
    category: 'gestion',
    order: 2,
    implemented: false,
    description: 'Editar información de usuarios existentes'
  },
  {
    id: 'movimientos',
    icon: 'bx-transfer',
    label: 'Movimientos',
    category: 'gestion',
    order: 3,
    implemented: false,
    description: 'Historial de cambios y movimientos'
  },

  // Permisos y Accesos
  {
    id: 'otorgar-permisos',
    icon: 'bx-key',
    label: 'Otorgar Permisos',
    category: 'permisos',
    order: 1,
    implemented: false,
    description: 'Asignar permisos y roles'
  },
  {
    id: 'control-accesos',
    icon: 'bx-lock-alt',
    label: 'Control de Accesos',
    category: 'permisos',
    order: 2,
    implemented: false,
    description: 'Monitoreo de accesos al sistema'
  },

  // Organización
  {
    id: 'usuario-organica',
    icon: 'bx-buildings',
    label: 'Usuario en Orgánica',
    category: 'organizacion',
    order: 1,
    implemented: false,
    description: 'Vista organizacional de usuarios'
  },
  {
    id: 'estructura-jerarquica',
    icon: 'bx-sitemap',
    label: 'Estructura Jerárquica',
    category: 'organizacion',
    order: 2,
    implemented: false,
    description: 'Visualización de la estructura militar'
  }
];

// Helpers
export const getSectionsByCategory = (categoryId) => {
  return USUARIO_SECTIONS
    .filter(section => section.category === categoryId)
    .sort((a, b) => a.order - b.order);
};

export const getCategories = () => {
  return USUARIO_CATEGORIES.sort((a, b) => a.order - b.order);
};

export const getImplementedSections = () => {
  return USUARIO_SECTIONS.filter(section => section.implemented);
};

export const getPendingSections = () => {
  return USUARIO_SECTIONS.filter(section => !section.implemented);
};

export const getSectionById = (sectionId) => {
  return USUARIO_SECTIONS.find(section => section.id === sectionId);
};

export const getCategoryById = (categoryId) => {
  return USUARIO_CATEGORIES.find(category => category.id === categoryId);
};