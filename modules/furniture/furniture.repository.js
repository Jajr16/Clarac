// Mobiliario Repository
var db = require("../../config/BaseDatos");
const AppError = require('../../errors/AppError.js');

exports.getAllFurnitures = async (username) => {
    try {
        const [rows] = await db.query("CALL showMob(?)", [username]);
    
        return rows[0] || [];
    } catch (error) {
        throw new AppError(`Error al obtener mobiliario: ${error.message}`, 500);
    }
}

exports.addFurniture = async (furniture) => {
    try {
        const [result] = await db.query('CALL AgregarUEMob(?,?,?,?,?,?)',
            [furniture.articulo, furniture.descripcion, furniture.encargado, furniture.ubi, furniture.cantidad, furniture.url]);

            return result;
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new AppError(
                'Ya existe el equipo que desea agregar.',
                409
            );
        }

        if(error.sqlState === '45000') {
            throw new AppError(error.message, 400);
        }

        throw new AppError(`Error al agregar mobiliario: ${error.message}`, 500);
    }
}

exports.editFurniture = async (furniture) => {
    try {
        const [result] = await db.query('CALL ModificarUEMob(?,?,?,?,?,?,?,?)',
            [furniture.n_art, furniture.n_desc, furniture.encargado, furniture.n_ubi, furniture.n_cant]
        )
    } catch (error) {
        
    }
}