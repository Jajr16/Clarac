// WAREHOUSE CONTROLLER
const service = require('./warehouse.service')

exports.getWarehouse = async (req, res, next) => {
    try {
        const result = await service.getWarehouse();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
