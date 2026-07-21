// Warehouse repository
var db = require('../../config/BaseDatos')
const AppError = require('../../errors/AppError.js')

exports.getAllProducts = async () => {
    const [rows] = await db.query('SELECT * FROM almacen ORDER BY eliminado');
    console.log(rows)
    return rows || null
}

exports.createProduct = async (data) => {
    try {
        const [result] = await db.query('INSERT INTO almacen VALUES (?,?,?,?,?,?)', [data.Cod_Barras, data.Categoria, data.Articulo, data.Marca, data.Descripcion, data.Unidad], function (err, result) {
            if (err) throw new AppError('Error al crear el producto', 500);
        })
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new AppError(
                'Ese producto ya está en el inventario',
                409
            )
        }

        if(error.sqlState === '45000') {
            throw new AppError(error.message, 400);
        }

        throw new AppError(`Error al agregar el producto: ${error.message}`, 500);
    }
}

exports.updateProduct = async (data) => {
    
}