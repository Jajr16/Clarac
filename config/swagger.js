const swaggerJsdoc = require('swagger-jsdoc');
const { maxLength } = require('zod');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Clarac API',
            version: '1.0.0',
            description: 'API para la gestión de recursos en Clarac',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desarrollo'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                login: {
                    type: 'object',
                    properties: {
                        username: { type: 'string' },
                        password: { type: 'string' }
                    },
                    required: ['username', 'password'],
                    example: {
                        username: 'ajimenez',
                        password: 'Clarac2017'
                    }
                },
                New_Device: {
                    type: 'object',
                    properties: {
                        ns: { type: 'string', maxLength: 45 },
                        equipo: { type: 'string', maxLength: 45 },
                        marca: { type: 'string', maxLength: 45 },
                        modelo: { type: 'string', maxLength: 45 },
                        encargado: { type: 'string', maxLength: 255 },
                        ubi: { type: 'string', maxLength: 45 },
                        hardware: { type: 'string', maxLength: 100 },
                        software: { type: 'string', maxLength: 100 },
                        ns_cpu: { type: 'string', maxLength: 45 },
                        mouse: { type: 'string', maxLength: 45 },
                        teclado: { type: 'string', maxLength: 45 },
                        accesorio: { type: 'string', maxLength: 255 }
                    },
                    example: {
                        ns: '12345',
                        equipo: 'Laptop',
                        marca: 'Dell',
                        modelo: 'XPS 15',
                        encargado: 'JIMENEZ RIVERA ARMANDO',
                        ubi: 'Oficina',
                        hardware: 'Intel i7, 16GB RAM, 512GB SSD',
                        software: 'Windows 10 Pro',
                        ns_cpu: '67890',
                        mouse: 'Logitech MX Master 3',
                        teclado: 'Logitech MX Keys',
                        accesorio: 'Docking Station'
                    }
                },
                Edit_Device: {
                    type: 'object',
                    properties: {
                        nso: { type: 'string', maxLength: 45 },
                        oencargado: { type: 'string', maxLength: 255 },
                        ns: { type: 'string', maxLength: 45 },
                        equipo: { type: 'string', maxLength: 45 },
                        marca: { type: 'string', maxLength: 45 },
                        modelo: { type: 'string', maxLength: 45 },
                        encargado: { type: 'string', maxLength: 255 },
                        ubi: { type: 'string', maxLength: 45 },
                        hardware: { type: 'string', maxLength: 100 },
                        software: { type: 'string', maxLength: 100 },
                        ns_cpu: { type: 'string', maxLength: 45 },
                        mouse: { type: 'string', maxLength: 45 },
                        teclado: { type: 'string', maxLength: 45 },
                        accesorio: { type: 'string', maxLength: 255 },
                    },
                    example: {
                        nso: '12345',
                        oencargado: 'JIMENEZ RIVERA ARMANDO',
                        ns: '123456789',
                        equipo: 'Laptop',
                        marca: 'Dell',
                        modelo: 'XPS 15',
                    }
                },
                Delete_Device: {
                    type: 'object',
                    properties: {
                        ns: { type: 'string', maxLength: 45 },
                        encargado: { type: 'string', maxLength: 255 }
                    },
                    example: {
                        ns: '12345',
                        encargado: 'JIMENEZ RIVERA ARMANDO'
                    }
                },
                New_Furniture: {
                    type: 'object',
                    properties: {
                        articulo: { type: 'string', maxLength: 100 },
                        descripcion: { type: 'string', maxLength: 255},
                        encargado: { type: 'string', maxLength: 255 },
                        ubi: { type: 'string', maxLength: 400 },
                        cantidad: { type: 'integer', minimum: 1 },
                        url: { type: 'string', maxLength: 255 }
                    },
                    example: {
                        articulo: 'Silla de oficina',
                        descripcion: 'Silla ergonómica con soporte lumbar',
                        encargado: 'JIMENEZ RIVERA ARMANDO',
                        ubi: 'Oficina',
                        cantidad: 10,
                        url: 'uploads/mobiliario/ejemplo.jpg'
                    }
                },
            }
        }
    },
    apis: ['./middleware/*.js', './modules/**/*.js'], // Rutas a los archivos con anotaciones Swagger
}

module.exports = swaggerJsdoc(options);