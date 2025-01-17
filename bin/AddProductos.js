var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')

function addProduct(req, callback) {
    const data = req.body

    db.query('insert into almacen values (?,?,?,?,?,?,?)', [data.Cod_Barras, data.Categoria, data.Articulo, data.Marca, data.Descripcion, data.Unidad, 0], function (err2, result) {
        if (err2) { Errores(err2); return callback(err2); } // Se hace un control de errores
        else {
            if (result) {;
                return callback(null, { type: 'success', message: 'Producto dado de alta.' })
            } else {
                return callback(null, { type: 'failed', message: 'El producto no se pudo dar de alta.' })
            }
        }
    });
}

module.exports = addProduct;