var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')

function modifyProd(req, callback) {
    const data = req.body
    
    db.query('UPDATE almacen SET Cod_Barras = ?, Categoria = ?, Articulo = ?, Marca = ?, Descripcion = ?, Unidad = ?, Existencia = ? WHERE Cod_Barras = ?', [data.Cod_Barras, data.Categoria, data.Articulo, data.Marca, data.Descripcion, data.Unidad, data.Existencia, data.dataOldCB], function (err2, result) {
        if (err2) { Errores(err2); } // Se hace un control de errores
        else {
            if (result.affectedRows > 0) { //Si sí hizo una búsqueda
                return callback(null, { type: 'RespDelProd', message: 'Producto modificado con éxito.', data: { Articulo: data.Articulo, Existencia: data.Existencia } });
            } else {
                return callback(null, { type: 'ErrorModProd', message: "No se pudo modificar el producto." })
            }
        }
    });
}

module.exports = modifyProd;