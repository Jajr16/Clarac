var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')

function consulmob(ws, data) {
    db.query('select Área from empleado inner join usuario on empleado.Num_emp = usuario.Num_emp where usuario = ?', [data.user], function (err, res) {

        if (err) { Errores(err); } // Se hace un control de errores
        else {
            if (res.length > 0) {//Si sí hizo una búsqueda
                if (!(res[0].Área === 'SISTEMAS')) {
                    db.query('select*from mobiliario', [data.user], function (err, result) {
                        if (err) { Errores(err); } // Se hace un control de errores
                        else {
                            if (result.length > 0) {//Si sí hizo una búsqueda
                                for (var i = 0; i < result.length; i++) {
                                    ws.send(JSON.stringify({ return: 'Desp_Mobiliario', Articulo: result[i].Articulo, Descripcion: result[i].Descripcion, Ubicacion: result[i].Ubicacion, Cantidad: result[i].Cantidad, Area: result[i].Área }))
                                }
                            }
                            result.length = 0;
                        }
                    });
                } else {
                    db.query('SELECT m.*, e.Nom FROM mobiliario m JOIN empleado e ON m.Num_emp = e.Num_emp', function (err, result) {
                        if (err) { Errores(err); } // Se hace un control de errores
                        else {
                            if (result.length > 0) {//Si sí hizo una búsqueda
                                for (var i = 0; i < result.length; i++) {
                                    ws.send(JSON.stringify({ return: 'Desp_Mobiliario', Articulo: result[i].Articulo, Descripcion: result[i].Descripcion, Ubicacion: result[i].Ubicacion, Cantidad: result[i].Cantidad, Area: result[i].Área }));//Mandar usuario y token al cliente
                                }
                            }
                            result.length = 0;
                        }
                    });
                }
            }
        }
    });
}

module.exports = consulmob