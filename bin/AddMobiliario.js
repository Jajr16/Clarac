const fs = require('fs');
var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')

function guardarArchivoJSON(data) {
    try {
        fs.writeFileSync('./public/javascripts/almacen_mobiliario.json', JSON.stringify(data, null, 4));
        console.log('Datos agregados al archivo JSON exitosamente.');
    } catch (error) {
        console.error('Error al guardar el archivo JSON:', error);
    }
}

function cargarArchivoJSON() {
    try {
        const data = fs.readFileSync('./public/javascripts/almacen_mobiliario.json');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
        return [];
    }
}

function addFurniture(req, callback) {
    const data = req.body
    console.log(data)
    console.log(data.articulo)

    db.query('SELECT empleado.Num_Emp, empleado.Área FROM empleado where empleado.Num_Emp = (select Num_Emp from Usuario where Usuario = ?)', [data.user], function (err, result) {
        if (err) { Errores(err); return callback(err); } // Se hace un control de errores
        else {
            if (result.length > 0) {//Si sí hizo una búsqueda

                var num_emp = result[0].Num_Emp; // Obtener el valor de Num_Emp del primer elemento del arreglo result
                var area = result[0].Área; // Se obtiene el area del arreglo

                db.query('insert into mobiliario values (NULL,?,?,?,?,?,?)', [data.articulo, data.descripcion, num_emp, data.Ubicacion, data.Cantidad, area], function (err2, result) {
                    if (err2) { Errores(err2); return callback(err); } // Se hace un control de errores
                    else {
                        if (result) {
                            let articulos = cargarArchivoJSON();

                            articulos.push({ "ARTICULO": data.Articulo });

                            guardarArchivoJSON(articulos);
                            return callback(null, { type: 'success', message: 'Mobiliario dado de alta.' })
                        }
                    }
                });
            } else {
                return callback(null, { type: 'failed', message: 'El mobiliario no se pudo dar de alta.' })
            }
        }
    });
}

module.exports = addFurniture;