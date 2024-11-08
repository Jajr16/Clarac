var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')

function consuleqp(req, callback) {
    const username = req.body?.username;
    if (!username) {
        return callback(new Error("Username no proporcionado en la solicitud"));
    }

    db.query('CALL showEqp(?)', [username], function (err, res) {
        if (err) {
            Errores(err);
            return callback(err);
        }

        const resultData = Array.isArray(res) && res[0] ? res[0] : []; // Accede a la primera matriz en `res`

        if (resultData.length > 0) { // Si se encontró el usuario
            const dataToSend = resultData.map(item => {
                let data = {}; // Inicializa un objeto vacío

                // Solo agrega los campos si no son NULL
                if (item.Num_Serie !== null) data.Num_Serie = item.Num_Serie;
                if (item.Equipo !== null) data.Equipo = item.Equipo;
                if (item.Marca !== null) data.Marca = item.Marca;
                if (item.Modelo !== null) data.Modelo = item.Modelo;
                if (item.Ubi !== null) data.Ubi = item.Ubi;
                if (item.Hardware !== null) data.Hardware = item.Hardware;
                if (item.Software !== null) data.Software = item.Software;
                if (item.Num_Serie_CPU !== null) data.Num_Serie_CPU = item.Num_Serie_CPU;
                if (item.Mouse !== null) data.Mouse = item.Mouse;
                if (item.Teclado !== null) data.Teclado = item.Teclado;
                if (item.Accesorio !== null) data.Accesorio = item.Accesorio;
                if (item.Nom !== null) data.Nom = item.Nom;
                return data; // Devuelve el objeto construido dinámicamente
            });
            return callback(null, dataToSend);
        } else {
            return callback(null, []); // Si no se encontró el usuario, devolver un arreglo vacío
        }
    });
}

module.exports = consuleqp;
