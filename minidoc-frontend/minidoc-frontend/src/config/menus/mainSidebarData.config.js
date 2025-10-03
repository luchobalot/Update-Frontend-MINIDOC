// src/config/menus/mainSidebar.config.js

/**
 * Configuración del menú lateral principal - Mesa de Trabajo
 * Este menú se muestra en la pantalla principal del sistema
 */

export const MAIN_SIDEBAR_SECTIONS = [
  {
    id: 'conocimiento',
    label: 'Conocimiento',
    icon: 'bx-clipboard',
    order: 1,
    implemented: true
  },
  {
    id: 'recibidos',
    label: 'Recibidos',
    icon: 'bx-download',
    order: 2,
    implemented: true
  },
  {
    id: 'girados',
    label: 'Girados',
    icon: 'bx-transfer',
    order: 3,
    implemented: true
  },
  {
    id: 'transmitidos',
    label: 'Transmitidos',
    icon: 'bx-send',
    order: 4,
    implemented: true
  },
  {
    id: 'archivados',
    label: 'Archivados',
    icon: 'bx-archive',
    order: 5,
    implemented: true
  }
];

export const MAIN_SIDEBAR_ACTIONS = [
  {
    id: 'busqueda-avanzada',
    label: 'Búsqueda Avanzada',
    icon: 'bx-search',
    order: 1,
    implemented: false
  },
  {
    id: 'cargar-recibidos',
    label: 'Cargar Recibidos',
    icon: 'bx-download',
    order: 2,
    implemented: false
  },
  {
    id: 'cargar-transmitidos',
    label: 'Cargar Transmitidos',
    icon: 'bx-upload',
    order: 3,
    implemented: false
  },
  {
    id: 'cargar-fax',
    label: 'Cargar FAX',
    icon: 'bx-envelope',
    order: 4,
    implemented: false
  },
  {
    id: 'recibir-todos',
    label: 'Recibir Todos',
    icon: 'bx-check-double',
    order: 5,
    implemented: false
  },
  {
    id: 'giro-interno',
    label: 'Giro Interno',
    icon: 'bx-refresh',
    order: 6,
    implemented: false
  },
  {
    id: 'archivar',
    label: 'Archivar Recibidos',
    icon: 'bx-archive-in',
    order: 7,
    implemented: false
  },
  {
    id: 'recibir-gfh',
    label: 'Recibir un GFH',
    icon: 'bx-plus-circle',
    order: 8,
    implemented: false
  }
];

// Helpers
export const getMainSidebarSections = () => {
  return MAIN_SIDEBAR_SECTIONS.sort((a, b) => a.order - b.order);
};

export const getMainSidebarActions = () => {
  return MAIN_SIDEBAR_ACTIONS.sort((a, b) => a.order - b.order);
};

export const getImplementedMainSections = () => {
  return MAIN_SIDEBAR_SECTIONS.filter(section => section.implemented);
};

export const getImplementedMainActions = () => {
  return MAIN_SIDEBAR_ACTIONS.filter(action => action.implemented);
};