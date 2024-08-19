var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')

function modifyMob(req, callback) {
    const data = req.body

    db.query('UPDATE mobiliario SET Articulo = ?, Descripcion = ?, Ubicacion = ?, Cantidad = ? WHERE Articulo = ? AND Descripcion = ? AND Num_emp = (SELECT Num_emp FROM usuario WHERE Usuario = ?)', [data.Narticulo, data.Ndescripcion, data.ubicacion, data.cantidad, data.articulo, data.descripcion, data.user], function (err2, result) {
        if (err2) { Errores(err2); return callback(err); } // Se hace un control de errores
        else {
            if (result.affectedRows > 0) { //Si sí hizo una búsqueda
                return callback(null, { type: 'RespDelMob', message: 'Mobiliario modificado con éxito.', data: { Articulo: data.Articulo, Cantidad: data.Cantidad } });
            } else {
                console.log(result)
                return callback(null, { type: 'ErrorModMob', message: "No se pudo modificar el mobiliario." })
            }
        }
    });
}

module.exports = modifyMob;