var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')
const { mobiliario_generatePDF } = require('../PDF_mobiliario.js');
const { equipos_generatePDF } = require('../PDF_equipos.js');

function getResponsives(req, callback) {
    let data = req.body

    db.query('SELECT Num_Emp, Área from empleado where Nom = ?', [data.NombreEmp], function (err, res) {
        if (err) { Errores(err); return callback(err); } // Se hace un control de errores
        else {
            if (res) {
                var num_emp = res[0].Num_Emp; // Obtener el valor de Num_Emp del primer elemento del arreglo result
                var areaEmp = res[0].Área;

                if (data.Responsiva == "MOBILIARIO") {
                    db.query('select*from mobiliario where Num_emp = ?;', [num_emp], function (err, res) {
                        if (err) { Errores(err); return callback(err); } // Se hace un control de errores
                        else {
                            if (res) {
                                console.log('si llegué aquí')
                                mobiliario_generatePDF(num_emp, areaEmp, data.NombreEmp, res)
                                .then((pdfBuffer) => {
                                        console.log('aquí también')
                                        return callback(null, { mensaje: 'Responsiva de mobiliario generada.', pdfBuffer });//Mandar mensaje de error a cliente
                                    }).catch(error => {
                                        console.error('Error al generar o descargar el PDF:', error);
                                        return callback(null, { err: true, mensaje: 'No se pudo generar la responsiva, inténtelo de nuevo' });
                                    });
                            }
                        }
                    });
                } else if (data.Responsiva == "EQUIPOS") {
                    db.query('SELECT DISTINCT Equipo.N_Inventario, Equipo.Num_Serie, Equipo.Equipo, Equipo.Marca, Equipo.Modelo, Equipo.Num_emp, PCs.Hardware, PCs.Software, Monitor.Num_Serie_CPU, Mouse.Mouse, Teclado.Teclado, Accesorio.Accesorio FROM Equipo LEFT JOIN PCs ON Equipo.Num_Serie = PCs.Num_Serie LEFT JOIN Monitor ON Equipo.Num_Serie = Monitor.Num_Serie_Monitor LEFT JOIN Mouse ON Equipo.Num_Serie = Mouse.Num_Serie LEFT JOIN Teclado ON Equipo.Num_Serie = Teclado.Num_Serie LEFT JOIN Accesorio ON Equipo.Num_Serie = Accesorio.Num_Serie WHERE Num_emp = ?;', [num_emp], function (err, res) {
                        if (err) { Errores(err); return callback(err); } // Se hace un control de errores
                        else {
                            if (res) {
                                equipos_generatePDF(num_emp, areaEmp, data.NombreEmp, res)
                                    .then((pdfBuffer) => {
                                        return callback(null, { mensaje: 'Responsiva de equipos generada.', pdfBuffer });//Mandar mensaje de error a cliente
                                    }).catch(error => {
                                        console.error('Error al generar o descargar el PDF:', error);
                                        return callback(null,  { err: true,  mensaje: 'No se pudo generar la responsiva, inténtelo de nuevo' });
                                    });
                            }
                        }
                    });
                }
            }
        }
    });
}

module.exports = getResponsives