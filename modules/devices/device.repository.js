// Device Repository
var db = require("../../config/BaseDatos");
const AppError = require('../../errors/AppError');

exports.getAllDevices = async (username) => {
    try {
        const [rows] = await db.query(
            "CALL showEqp(?)",
            [username]
        );
    
        return rows[0] || [];
    } catch (error) {
        throw new AppError(`Error al obtener equipos: ${error.message}`, 500);
    }
}

exports.addDevice = async (device) => {
    try {
        const [result] = await db.query(
            "CALL AgregarEquipos(?,?,?,?,?,?,?,?,?,?,?,?)",
            [device.ns, device.equipo, device.marca, device.modelo, device.encargado, device.ubi, device.hardware,
            device.software, device.ns_cpu, device.mouse, device.teclado, device.accesorio]
        );

        return result;
    } catch (err) {

        if (err.code === 'ER_DUP_ENTRY') {
            throw new AppError(
                'Ya existe un equipo con ese número de serie',
                409
            );
        }

        if (err.sqlState === '45000') {
            throw new AppError(err.message, 400);
        }

        throw new AppError(`Error al agregar equipo: ${err.message}`, 500);
    }
};

exports.editDevice = async (device) => {
    try {
        const [result] = await db.query(
            "CALL ActualizarEquipos(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [device.ns, device.equipo, device.marca, device.modelo, device.ubi, device.nso, device.encargado, device.oencargado,
            device.hardware, device.software, device.ns_cpu, device.mouse, device.teclado, device.accesorio]
        );

        return result;
    } catch (err) {
        if (err.sqlState === '45000') {
            throw new AppError(err.message, 400);
        }

        if (err.code === 'ER_DUP_ENTRY') {
            throw new AppError(
                'Ya existe un equipo con ese número de serie',
                409
            );
        }

        console.log(err);

        throw new AppError(`Error al actualizar equipo: ${err.message}`, 500);
    }
};

exports.deleteDevice = async (device) => {
    try {
        const [result] = await db.query(
            "CALL EliminarEquipo(?,?)",
            [device.ns, device.encargado]
        )

        return result
    } catch (error) {
        if (error.sqlState === '45000') {
            throw new AppError(error.sqlMessage, 404);
        }

        throw new AppError(`Error al actualizar equipo: ${error}`, 500);
    }
}