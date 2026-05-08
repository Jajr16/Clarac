const { z } = require('zod');

const furnitureBase = z.object({
    articulo: z.string().min(1).max(100),
    descripcion: z.string().min(1).max(400).optional().nullable(),
    encargado: z.string().min(1).max(255),
    ubi: z.string().min(1).max(400),
    cantidad: z.number().int().positive(),
    url: z.string().max(255).optional().nullable()
})

exports.addFurnitureSchema = furnitureBase;