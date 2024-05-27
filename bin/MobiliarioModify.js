var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')
const WebSocket = require('ws');

function modifyMob(wss, data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            db.query('update mobiliario set Articulo = ?, Descripcion = ?, Ubicacion = ?, Cantidad = ? where Articulo = ?', [data.data.Articulo, data.data.Descripcion, data.data.Ubicacion, data.data.Cantidad, data.data.dataOld], function (err2, result) {
                if (err2) { Errores(err2); } // Se hace un control de errores
                else {
                    if (result.affectedRows > 0) { //Si sí hizo una búsqueda
                        client.send(JSON.stringify({type: 'RespDelMob', message: 'Mobiliario modificado con éxito.', data: {Articulo: data.data.Articulo, Cantidad: data.data.Cantidad} }));//Mandar mensaje a cliente
                    } else {
                        client.send(JSON.stringify({type: 'ErrorModMob', message: "No se pudo modificar el mobiliario." }))
                    }
                }
            });
        }
    });
}

module.exports = modifyMob