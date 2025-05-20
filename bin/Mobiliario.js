var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')

function consulmob(req, callback) {
    const data = req.body;
    console.log(`Los datos que llegan a Mobiliario son: ${JSON.stringify(data)}`)
    
    db.query(`CALL showMob(?)`, [data.username], function (err2, result) {
        if (err2) { Errores(err2); } // Se hace un control de errores
        else {
            if (result.length > 0) {
                const dataToSend = result[0].map(item => ({
                    Articulo: item.Articulo,
                    Descripcion: item.Descripcion,
                    Ubicacion: item.Ubicacion,
                    Cantidad: item.Cantidad,
                    Area: item.Área,
                    Nombre: item.Nom,
                    Usuario: item.usuario
                }));
                return callback(null, dataToSend);
            } else {
                return callback(null, []); 
            }
        }
    });
}

module.exports = consulmob;
