module.exports = {
    INVALID_CREDENTIALS: {
        message: 'Usuario o contraseña incorrectos',
        status: 401
    },

    EMPLOYEE_NOT_FOUND: {
        message: 'Empleado no encontrado',
        status: 404
    },

    CPU_NOT_FOUND: {
        message: 'No existe un CPU con ese número de serie',
        status: 404
    },

    DEVICE_NOT_CREATED: {
        message: 'No se pudo crear el dispositivo',
        status: 500
    },

    DEVICE_NOT_UPDATED: {
        message: 'No se pudo actualizar el dispositivo',
        status: 500
    },

    NO_PERMISSION: {
        message: 'No tienes permisos para esta acción',
        status: 403
    },

    TOKEN_REQUIRED: {
        message: 'Token de autenticación requerido',
        status: 401
    },

    INVALID_TOKEN: {
        message: 'Token de autenticación inválido o expirado',
        status: 401
    },

    NOT_FOUND: {
        message: 'No hay nada por el momento.',
        status: 404
    },

    CREATE_ITEM_ERROR: {
        message: 'Hubo un error al crear el producto.',
        status: 500
    },
    DEVICE_NOT_DELETED: {
        message: 'No se pudo eliminar el equipo',
        status: 500
    },
    FORBIDDEN: {
        message: 'No tienes permisos para realizar esta acción',
        status: 403
    }
};
