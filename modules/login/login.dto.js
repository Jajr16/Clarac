const { z } = require('zod');

exports.loginSchema = z.object({
    username: z
        .string()
        .min(1, 'Usuario requerido')
        .max(45),

    password: z
        .string()
        .min(1, 'Contraseña requerida')
        .max(255)
});
