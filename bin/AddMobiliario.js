const fs = require('fs');
var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')
const WebSocket = require('ws');

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

function addFurniture(wss, data) {
    console.log(data)
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            db.query('SELECT empleado.Num_Emp, empleado.Área FROM empleado where empleado.Num_Emp = (select Num_Emp from Usuario where Usuario = ?)', [data.data.User], function (err, result) {
                if (err) { Errores(err); } // Se hace un control de errores
                else {
                    if (result.length > 0) {//Si sí hizo una búsqueda

                        var num_emp = result[0].Num_Emp; // Obtener el valor de Num_Emp del primer elemento del arreglo result
                        var area = result[0].Área; // Se obtiene el area del arreglo

                        db.query('insert into mobiliario values (NULL,?,?,?,?,?,?)', [data.data.Articulo, data.data.Descripcion, num_emp, data.data.Ubicacion, data.data.Cantidad, area], function (err2, result) {
                            if (err2) { Errores(err2); } // Se hace un control de errores
                            else {
                                if (result) {
                                    let articulos = cargarArchivoJSON();
                                    
                                    articulos.push({ "ARTICULO": data.data.Articulo });
                                    
                                    guardarArchivoJSON(articulos);
                                    
                                    wss.clients.forEach(client => {
                                        if (client.readyState === WebSocket.OPEN) {
                                            client.send(JSON.stringify({type: 'Mobiliario_Respuesta', message: 'Mobiliario dado de alta.' }))
                                            client.send(JSON.stringify({ type: 'Actualizar_Tabla', Articulo: data.data.Articulo, Cantidad: data.data.Cantidad }));
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        client.send(JSON.stringify({type: 'Error_Mobiliario_Respuesta', message: 'El mobiliario no se pudo dar de alta.' }))
                    }
                }
            });
        }
    });
}

module.exports = addFurniture