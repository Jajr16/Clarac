document.addEventListener('DOMContentLoaded', () => {
    // 1. Extraemos de forma segura los datos de autenticación del cliente
    const rawPermissions = localStorage.getItem('permissions');
    const userArea = localStorage.getItem('area');
    
    if (!rawPermissions) return;

    try {
        const permissions = JSON.parse(rawPermissions);

        // 2. Seleccionamos de forma estricta todos los elementos protegidos
        const secureElements = document.querySelectorAll('[data-module]');

        secureElements.forEach(element => {
            const moduleName = element.getAttribute('data-module');
            const requiredPermission = element.getAttribute('data-permission');

            const userModulePermissions = permissions[moduleName] || [];

            // REGLA DE ORO DE ACCESOS: Si el usuario es 'super' del módulo, 
            // o si cuenta explícitamente con la acción requerida, se le permite acceso visual.
            if (userModulePermissions.includes('super') || userModulePermissions.includes(requiredPermission)) {
                // Removemos el bloqueo quitando el style innecesario
                element.style.display = ''; 
            }
        });

        // 3. Regla de Negocio Exclusiva: Solicitudes de Dirección General
        const subDireccion = document.getElementById('menu-solicitudes-direccion');
        
        if (subDireccion && permissions['PETICIONES'] && userArea === 'DIRECCION GENERAL') {
            subDireccion.style.display = '';
        }

    } catch (error) {
        console.error("Error en la ejecución de la directiva de accesos del Sidebar:", error);
    }
});
