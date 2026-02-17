const { z } = require('zod');

const deviceBase = z.object({
    ns: z.string().min(1).max(45),
    equipo: z.string().min(1).max(45),
    marca: z.string().min(1).max(45),
    modelo: z.string().min(1).max(45),
    encargado: z.string().min(1).max(255),
    ubi: z.string().min(1).max(45),
    hardware: z.string().max(100).optional().nullable(),
    software: z.string().max(100).optional().nullable(),
    ns_cpu: z.string().max(45).optional().nullable(),
    mouse: z.string().max(45).optional().nullable(),
    teclado: z.string().max(45).optional().nullable(),
    accesorio: z.string().max(255).optional().nullable()
})

exports.addDeviceSchema = deviceBase

exports.editDeviceSchema = deviceBase.partial().extend({
    nso: z.string().min(1).max(45),
    oencargado: z.string().min(1).max(255)
})