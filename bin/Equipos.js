var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')

function consuleqp(req, callback) {
    const { username } = req.body;

    db.query('SELECT Área FROM empleado INNER JOIN usuario ON empleado.Num_emp = usuario.Num_emp WHERE usuario = ?', [username], function (err, res) {
        if (err) {
            Errores(err);
            return callback(err);
        }

        if (res.length > 0) { // Si se encontró el usuario
            if (!(res[0].Área === 'SISTEMAS')) {
                db.query('SELECT DISTINCT Equipo.N_Inventario, Equipo.Num_Serie, Equipo.Equipo, Equipo.Marca, Equipo.Modelo, Equipo.Ubi, Equipo.Num_emp, PCs.Hardware, PCs.Software, Monitor.Num_Serie_CPU, Mouse.Mouse, Teclado.Teclado, Accesorio.Accesorio FROM Equipo LEFT JOIN PCs ON Equipo.Num_Serie = PCs.Num_Serie LEFT JOIN Monitor ON Monitor.Num_Serie_Monitor = Equipo.Num_Serie LEFT JOIN Mouse ON Equipo.Num_Serie = Mouse.Num_Serie LEFT JOIN Teclado ON Equipo.Num_Serie = Teclado.Num_Serie LEFT JOIN Accesorio ON Equipo.Num_Serie = Accesorio.Num_Serie;', function (err, result) {
                    if (err) {
                        Errores(err);
                        return callback(err);
                    }

                    const dataToSend = result.map(item => {
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

                        return data; // Devuelve el objeto construido dinámicamente
                    });
                    return callback(null, dataToSend);
                });
            } else {
                db.query('SELECT DISTINCT Equipo.N_Inventario, Equipo.Num_Serie, Equipo.Equipo, Equipo.Marca, Equipo.Modelo, Equipo.Ubi, Equipo.Num_emp, PCs.Hardware, PCs.Software, Monitor.Num_Serie_CPU, Mouse.Mouse, Teclado.Teclado, Accesorio.Accesorio, e.Nom FROM Equipo LEFT JOIN PCs ON Equipo.Num_Serie = PCs.Num_Serie LEFT JOIN Monitor ON Equipo.Num_Serie = Monitor.Num_Serie_Monitor LEFT JOIN Mouse ON Equipo.Num_Serie = Mouse.Num_Serie LEFT JOIN Teclado ON Equipo.Num_Serie = Teclado.Num_Serie LEFT JOIN Accesorio ON Equipo.Num_Serie = Accesorio.Num_Serie join empleado e on Equipo.Num_emp = e.Num_emp;', function (err, result) {
                    if (err) {
                        Errores(err);
                        return callback(err);
                    }

                    const dataToSend = result.map(item => {
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
                });

            }
        } else {
            return callback(null, []); // Si no se encontró el usuario, devolver un arreglo vacío
        }
    });
}

module.exports = consuleqp;
