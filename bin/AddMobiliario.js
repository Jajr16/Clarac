const fs = require('fs');
var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')
var success = require('./success')

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

    const data = req.body;
    
    const usuario = data.user || null;
    const encargado = data.encargado || null;

    console.log("el usuario es " + usuario);
    console.log("el encargado es " + encargado);
    
    db.query('CALL AgregarUEMob(?,?,?,?,?,?)', [data.articulo, data.descripcion, usuario, encargado, data.Ubicacion, data.Cantidad], function (err, result) {
        if (err) { Errores(err); return callback(err); } // Se hace un control de errores
        else {
            if (result) {
                if (success(result) == 'Success'){
                    console.log(result)
                    let articulos = cargarArchivoJSON();
    
                    articulos.push({ "ARTICULO": data.Articulo });
    
                    guardarArchivoJSON(articulos);

                    return callback(null, { type: 'success', message: 'Mobiliario dado de alta.' });
                }else {
                    Errores(`${result.Code, result.Message}`);
                    return callback(null, { type: 'failed', message: `El mobiliario no se pudo dar de alta.` })
                }
            }
        }
    });
}

module.exports = addFurniture;