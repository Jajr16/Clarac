// Device Service
const repo = require('./device.repository');

const AppError = require('../../errors/AppError');
const ERRORS = require('../../errors/errorCodes');

const { mapDevices, normalizeAccesory } = require('./device.mapper');

exports.getAllDevices = async (username) => {

    const devices = await repo.getAllDevices(username);

    if (!devices || devices.length === 0) throw new AppError(
        ERRORS.NOT_FOUND.message,
        ERRORS.NOT_FOUND.status
    );

    return mapDevices(devices);
}

exports.addDevice = async (device) => {
    const normalizedDevice = normalizeAccesory(device);

    const result = await repo.addDevice(normalizedDevice);

    if (!result) {
        throw new AppError(
            ERRORS.DEVICE_NOT_CREATED.message,
            ERRORS.DEVICE_NOT_CREATED.status
        );
    }

    return result;
};


exports.editDevice = async (device) => {
    const normalizedDevice = normalizeAccesory(device);

    const result = await repo.editDevice(normalizedDevice);

    if (!result) {
        throw new AppError(
            ERRORS.DEVICE_NOT_UPDATED.message,
            ERRORS.DEVICE_NOT_UPDATED.status
        );
    }

    return result;
};

exports.deleteDevice = async (device) => {
    const result = await repo.deleteDevice(device)

    if (!result) {
        throw new AppError(
            ERRORS.DEVICE_NOT_DELETED.message,
            ERRORS.DEVICE_NOT_DELETED.status
        );
    }

    return true
}