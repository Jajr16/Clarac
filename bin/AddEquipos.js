var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')
var success = require('./success')

function addEquipo(req, callback) {
    const data = req.body
    console.log(`Los datos son: ${JSON.stringify(data)}`);

    const Hardware = data.Hardware || null;
    const Software = data.Software || null;
    const Num_Serie_CPU = data.Num_Serie_CPU || null;
    const Mouse = data.Mouse || null;
    const Teclado = data.Teclado || null;
    const Accesorio = data.Accesorio || null;

    db.query('CALL AgregarEquipos(?,?,?,?,?,?,?,?,?,?,?,?)', [data.Num_Serie, data.Equipo, data.Marca, data.Modelo, data.Encargado, data.Ubi, Hardware, Software, Num_Serie_CPU, Mouse, Teclado, Accesorio], function (err, result) {
        if (err) { 
            if (err.code === 'ER_DUP_ENTRY') { // Manejar error de llave duplicada
                return callback(null, { type: 'failed', message: 'Ya existe un equipo con ese número de serie.' });
            } else {
                console.log(`Los errores: ${JSON.stringify(err)}`)
                Errores(err); // Otros errores
                return callback(err);
            }
        } // Se hace un control de errores
        else {
            if (result.length > 0) {//Si sí hizo una búsqueda
                if (success(result) == 'Success'){
                    return callback(null, { type: 'success', message: 'Equipo dado de alta.' });
                }else {
                    if (Array.isArray(result) && Array.isArray(result[0]) && result[0][0]?.Code === 1062) {
                        return callback(null, { type: 'failed', message: `Ese equipo ya está dado de alta.` })
                    }
                    console.log(`Los errores so: ${JSON.stringify(result)}`)
                    Errores(result);
                    return callback(null, { type: 'failed', message: `El equipo no se pudo dar de alta.` })
                }
                
            } else {
                return callback(null, { type: 'failed', message: 'El equipo no se pudo dar de alta.' })
            }
        }
    });


}

module.exports = addEquipo;