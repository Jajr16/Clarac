var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error');
var success = require('./success');

function modifyMob(req, callback) {
    
    const data = req.body;

    const usuario = data.user || null;          // Usuario actual (puede ser nulo)
    const encargado = data.encargado || null;   // Encargado (puede ser nulo)

    // Realizar la llamada al procedimiento almacenado
    db.query('CALL ModificarUEMob(?, ?, ?, ?, ?, ?, ?, ?)', 
        [data.Narticulo, data.Ndescripcion, usuario, encargado, data.ubicacion, data.cantidad, data.articulo, data.descripcion], 
        function (err, result) {
            if (err) { 
                Errores(err); 
                return callback(err); // Se hace un control de errores
            } else {
                if (result) {
                    if (success(result) == 'Success') {
                        console.log(result);
                        return callback(null, { type: 'success', message: 'Mobiliario modificado correctamente.' });
                    } else {
                        Errores(`${result.Code, result.Message}`);
                        return callback(null, { type: 'failed', message: `El mobiliario no se pudo dar de alta.` })
                    }
                }
            }
        }
    );
}

module.exports = modifyMob;
