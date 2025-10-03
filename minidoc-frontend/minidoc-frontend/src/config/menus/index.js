// src/config/menus/index.js

/**
 * Punto de entrada centralizado para todas las configuraciones de menús
 * Permite importar todo desde un solo lugar
 */

// Main Sidebar (Mesa de Trabajo)
export {
  MAIN_SIDEBAR_SECTIONS,
  MAIN_SIDEBAR_ACTIONS,
  getMainSidebarSections,
  getMainSidebarActions,
  getImplementedMainSections,
  getImplementedMainActions
} from './mainSidebar.config';

// Usuario Sidebar
export {
  USUARIO_CATEGORIES,
  USUARIO_SECTIONS,
  getSectionsByCategory,
  getCategories,
  getImplementedSections,
  getPendingSections,
  getSectionById,
  getCategoryById
} from './usuarioSidebar.config';

/**
 * Uso:
 * 
 * // Opción 1: Importar específico
 * import { USUARIO_SECTIONS } from '@/config/menus/usuarioSidebar.config';
 * 
 * // Opción 2: Importar desde index
 * import { USUARIO_SECTIONS, MAIN_SIDEBAR_SECTIONS } from '@/config/menus';
 */