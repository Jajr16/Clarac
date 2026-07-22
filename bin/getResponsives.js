var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error');
const { mobiliario_generatePDF } = require('../PDF_mobiliario.js');
const { equipos_generatePDF } = require('../PDF_equipos.js');

function getResponsives(req, callback) {
    let data = req.body;
    console.log("Datos recibidos en backend:", data);

    // 1. Consulta inicial para obtener los datos del empleado
    db.query('SELECT Num_Emp, Área FROM empleado WHERE Nom = ?', [data.NombreEmp], function (err, resEmpleado) {
        if (err) { 
            Errores(err); 
            return callback(err); 
        }

        // 🛡️ REGLA DEFENSIVA IMPRESCINDIBLE: Validar si la base de datos realmente encontró al empleado
        if (!resEmpleado || resEmpleado.length === 0) {
            console.error(`Error: No se encontró al empleado "${data.NombreEmp}" en la base de datos.`);
            return callback(null, { err: true, mensaje: 'El empleado seleccionado no existe en los registros.' });
        }

        // Si existe, extraemos sus datos de forma segura sin peligro de que tire el servidor
        var num_emp = resEmpleado[0].Num_Emp;
        var areaEmp = resEmpleado[0].Área;
        var ubicacion = data.Ubicacion;

        // 2. Preparamos las variables dinámicas de consulta según el Tipo de Responsiva
        let querySQL = '';
        let queryParams = [];
        let pdfGeneratorFunction = null;
        let tipoNombre = '';

        if (data.Responsiva === "MOBILIARIO") {
            pdfGeneratorFunction = mobiliario_generatePDF;
            tipoNombre = 'mobiliario';
            
            if (ubicacion) {
                querySQL = 'SELECT * FROM mobiliario WHERE Ubicacion = ?;';
                queryParams = [ubicacion];
            } else {
                querySQL = 'SELECT * FROM mobiliario WHERE Num_emp = ? ORDER BY Ubicacion;';
                queryParams = [num_emp];
            }
        } else if (data.Responsiva === "EQUIPOS") {
            pdfGeneratorFunction = equipos_generatePDF;
            tipoNombre = 'equipos';

            // Definimos el Query base gigante una sola vez para no duplicar código en el archivo
            const baseQueryEquipos = `
                SELECT DISTINCT 
                    Equipo.N_Inventario, Equipo.Num_Serie, Equipo.Equipo, Equipo.Marca, Equipo.Modelo, 
                    Equipo.Num_emp, Equipo.Ubi, PCs.Hardware, PCs.Software, Monitor.Num_Serie_CPU, 
                    Mouse.Mouse, Teclado.Teclado, Accesorio.Accesorio 
                FROM Equipo 
                LEFT JOIN PCs ON Equipo.Num_Serie = PCs.Num_Serie 
                LEFT JOIN Monitor ON Equipo.Num_Serie = Monitor.Num_Serie_Monitor 
                LEFT JOIN Mouse ON Equipo.Num_Serie = Mouse.Num_Serie 
                LEFT JOIN Teclado ON Equipo.Num_Serie = Teclado.Num_Serie 
                LEFT JOIN Accesorio ON Equipo.Num_Serie = Accesorio.Num_Serie
            `;

            if (ubicacion) {
                querySQL = `${baseQueryEquipos} WHERE Ubi = ?;`;
                queryParams = [ubicacion];
            } else {
                querySQL = `${baseQueryEquipos} WHERE Num_emp = ? ORDER BY Ubi;`;
                queryParams = [num_emp];
            }
        } else {
            return callback(null, { err: true, mensaje: 'Tipo de responsiva no válido.' });
        }

        // 3. 🚀 CENTRALIZACIÓN ABSOLUTA: Una sola consulta SQL para cualquier escenario
        db.query(querySQL, queryParams, function (err, resDatos) {
            if (err) { 
                Errores(err); 
                return callback(err); 
            }

            // Validamos que la respuesta contenga datos antes de procesar el PDF
            if (!resDatos) {
                return callback(null, { err: true, mensaje: 'No se encontraron artículos para generar la responsiva.' });
            }

            pdfGeneratorFunction(num_emp, areaEmp, data.NombreEmp, resDatos)
                .then((pdfBuffer) => {
                    console.log(`PDF de ${tipoNombre} generado exitosamente en buffer.`);
                    return callback(null, { mensaje: `Responsiva de ${tipoNombre} generada.`, pdfBuffer });
                })
                .catch(error => {
                    console.error(`Error al generar o descargar el PDF de ${tipoNombre}:`, error);
                    return callback(null, { err: true, mensaje: 'No se pudo generar la responsiva, inténtelo de nuevo.' });
                });
        });
    });
}

module.exports = getResponsives;
