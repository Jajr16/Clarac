// frontend/permissions.js
export function getAuth() {
    let permissions = {};
    try {
        permissions = JSON.parse(localStorage.getItem('permissions')) || {};
    } catch (err) {
        console.error('No se pudo parsear los permisos guardados:', err);
    }

    return {
        token: localStorage.getItem('token'), // string plano, no necesita JSON.parse
        permissions
    };
}

export function hasPermission(userPermissions, moduleName, action) {
    const perms = userPermissions?.[moduleName];
    if (!Array.isArray(perms)) return false;
    return perms.includes('super') || perms.includes(action);
}