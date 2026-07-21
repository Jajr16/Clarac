// shared/base.repository.js
const db = require("../config/BaseDatos");
const AppError = require("../errors/AppError");

/**
 * Ejecuta una actualización parcial dinámica para cualquier tabla y tipo de llave (simple o compuesta).
 * @param {string} tableName - Nombre de la tabla (ej: 'usuario_permiso', 'almacen')
 * @param {Object} conditions - Objeto con las llaves primarias { Columna: Valor }
 * @param {Object} fields - Objeto con los campos modificados { Columna: Valor }
 */
async function updatePartialGeneric(tableName, conditions, fields) {
    // 1. Desarmamos los campos a actualizar (SET Clause)
    const updateColumns = Object.keys(fields);
    const setClause = updateColumns.map(col => `${col} = ?`).join(', ');
    const updateValues = Object.values(fields);
    
    // 2. Desarmamos las condiciones de búsqueda (WHERE Clause)
    const conditionColumns = Object.keys(conditions);
    // Crea la estructura: "Col1 = ? AND Col2 = ?"
    const whereClause = conditionColumns.map(col => `${col} = ?`).join(' AND '); 
    const conditionValues = Object.values(conditions);

    // 3. Juntamos todos los valores en un solo arreglo (Primero los del SET, luego los del WHERE)
    const totalValues = [...updateValues, ...conditionValues];

    // 4. Armamos la consulta final
    const query = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`;

    try {
        const [result] = await db.query(query, totalValues);

        if (result.affectedRows === 0) {
            throw new AppError(`No se encontró el registro en la tabla ${tableName} con las condiciones proporcionadas.`, 404);
        }

        return { ...conditions, ...fields };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(`Error de base de datos en ${tableName}: ${error.message}`, 500);
    }
}

module.exports = { updatePartialGeneric };