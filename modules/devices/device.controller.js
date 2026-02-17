// Device Controller
const service = require('./device.service');

exports.getAllDevices = async (req, res, next) => {
    try {
        const result = await service.getAllDevices(req.user.username);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

exports.addDevice = async (req, res, next) => {
    try {
        const result = await service.addDevice(req.body)
        res.status(201).json({
            message: 'Dispositivo agregado exitosamente',
            result
        });
    } catch (error) {
        next(error)
    }
}

exports.editDevice = async (req, res, next) => {
    try {
        const result = await service.editDevice(req.body)
        res.status(200).json({
            message: 'Dispositivo editado correctamente',
            result
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteDevice = async (req, res, next) => {
    try {
        await service.deleteDevice(req.body)
        
        res.status(200).json({
            message: 'Dispositivo eliminado correctamente'
        })
    } catch (error) {
        next(error)
    }
}