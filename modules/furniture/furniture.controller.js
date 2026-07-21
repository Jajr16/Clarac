// Furniture Controller
const service = require('./furniture.service');

exports.getAllFurnitures = async (req, res, next) => {
    try {
        const result = await service.getAllFurnitures(req.user.username);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

exports.addFurniture = async (req, res, next) => {
    try {
        const result = await service.addFurniture(req.body);
        res.status(201).json({
            message: 'Mobiliario agregado exitosamente',
            result
        })
    } catch (error) {
        next(error);
    }
}
