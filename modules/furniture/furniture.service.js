// Furniture Service
const repo = require('./furniture.repository');

const AppError = require('../../errors/AppError');
const ERRORS = require('../../errors/errorCodes');

exports.getAllFurnitures = async (username) => {
    const furnitures = await repo.getAllFurnitures(username);

    if (!furnitures || furnitures.length === 0) throw new AppError(
        ERRORS.NOT_FOUND.message,
        ERRORS.NOT_FOUND.status
    )

    return furnitures;
}

exports.addFurniture = async (furniture) => {
    const result = await repo.addFurniture(furniture);

    if(!result) {
        throw new AppError(
            ERRORS.CREATE_ITEM_ERROR.message,
            ERRORS.CREATE_ITEM_ERROR.status
        );
    }

    return result;
}