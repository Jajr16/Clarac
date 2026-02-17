// Device Mapper
exports.mapDevice = device => ({
    ...device,
    ...(device.Num_Serie !== null && { ns: device.Num_Serie }),
    ...(device.Marca !== null && { marca: device.Marca }),
    ...(device.Modelo !== null && { modelo: device.Modelo }),
    ...(device.Ubi !== null && { ubi: device.Ubi }),
    ...(device.Hardware !== null && { hardware: device.Hardware }),
    ...(device.Software !== null && { software: device.Software }),
    ...(device.Num_Serie_CPU !== null && { ns_cpu: device.Num_Serie_CPU }),
    ...(device.Mouse !== null && { mouse: device.Mouse }),
    ...(device.Teclado !== null && { teclado: device.Teclado }),
    ...(device.Accesorio !== null && { accesorio: device.Accesorio }),
    ...(device.Nom !== null && { encargado: device.Nom })
})

exports.mapDevices = (devices) => devices.map(exports.mapDevice)

// Accesory mapper
exports.normalizeAccesory = device => {
    return {
        ...device,
        hardware: device.hardware ?? null,
        software: device.software ?? null,
        ns_cpu: device.ns_cpu ?? null,
        mouse: device.mouse ?? null,
        teclado: device.teclado ?? null,
        accesorio: device.accesorio ?? null
    }
}