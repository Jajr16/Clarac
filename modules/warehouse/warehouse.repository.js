// Warehouse repository
var db = require('../../config/BaseDatos')
const AppError = require('../../errors/AppError.js')

exports.getAllProducts = async () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM almacen ORDER BY eliminado', (err, result) => {
            if (err) return reject(new AppError(`Error al obtener productos: ${err.message}`, 500));
            resolve(result || [])
        })
    })
}