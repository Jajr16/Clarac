// Warehouse Service
const repo = require('./warehouse.repository');

const AppError = require('../../errors/AppError');
const ERRORS = require('../../errors/errorCodes');




exports.getWarehouse = async () => {
    const response = await repo.getAllProducts();

    if (!response || response.length === 0) throw new AppError(
        ERRORS.NOT_FOUND.message,
        ERRORS.NOT_FOUND.status
    );
    console.log(response);
    
    return response;
}