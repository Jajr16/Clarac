// public/javascripts/shared/permissions.js

/**
 * Verifica si el usuario tiene un permiso específico en un módulo.
 * @param {string} moduleName - Ejemplo: 'EQUIPOS'
 * @param {string} permission - Ejemplo: 'create'
 * @returns {boolean}
 */
export function hasPermission(moduleName, permission) {
    const rawPermissions = localStorage.getItem('permissions');
    if (!rawPermissions) return false;

    try {
        const permissions = JSON.parse(rawPermissions);
        return permissions?.[moduleName]?.includes(permission) || false;
    } catch (error) {
        console.error("Error al leer los permisos:", error);
        return false;
    }
}

/**
 * Oculta elementos del DOM si el usuario no tiene el permiso requerido.
 * @param {string} elementId - ID del botón o contenedor
 * @param {string} moduleName 
 * @param {string} permission 
 */
export function checkUIElement(elementId, moduleName, permission) {
    const element = document.getElementById(elementId);
    if (element && !hasPermission(moduleName, permission)) {
        element.style.display = 'none';
    }
}