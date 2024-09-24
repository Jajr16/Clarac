var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')

function addEquipo(req, callback) {
    const data = req.body

    db.query('SELECT empleado.Num_Emp FROM empleado where empleado.Num_Emp = (select Num_Emp from Usuario where Usuario = ?)', [data.User], function (err, result) {
        if (err) { Errores(err); return callback(err); } // Se hace un control de errores
        else {
            if (result.length > 0) {//Si sí hizo una búsqueda

                var num_emp = result[0].Num_Emp; // Obtener el valor de Num_Emp del primer elemento del arreglo result

                db.query('insert into equipo values (NULL,?,?,?,?,?,?)', [data.Num_Serie, data.Equipo, data.Marca, data.Modelo, num_emp, data.Ubi], function (err2, result) {
                    if (err2) {
                        if (err2.code === 'ER_DUP_ENTRY') { // Manejar error de llave duplicada
                            return callback(null, { type: 'failed', message: 'Ya existe un equipo con ese número de serie.' });
                        } else {
                            Errores(err2); // Otros errores
                            return callback(err2);
                        }
                    } // Se hace un control de errores
                    else {
                        if (result) {
                            bandera = true
                            mensaje = ''

                            // DAR DE ALTA PC's DE CPU 
                            if (data.Hardware && data.Software) {
                                db.query('select * from pcs where Num_Serie = ?', [data.Num_Serie], async function (err, result) {
                                    if (err) { Errores(err); return callback(err); } // Se hace un control de errores
                                    else {
                                        if (result.length > 0) {
                                            bandera = false
                                        } else {
                                            db.query('insert into pcs values(?,?,?)', [data.Num_Serie, data.Hardware, data.Software], async function (err, result) {
                                                if (err) { Errores(err); return callback(err); } // Se hace un control de errores
                                                else {
                                                    if (!result) {
                                                        bandera = false
                                                        mensaje = 'Falló al dar de alta el hardware y software, hágalo por separado.'
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                            // DAR DE ALTA MOUSES
                            if (data.Mouse) {
                                db.query('select * from Mouse where Num_Serie = ?', [data.Num_Serie], async function (err, result) {
                                    if (err) { Errores(err); return callback(err); } // Se hace un control de errores
                                    else {
                                        if (result.length > 0) {
                                            bandera = false
                                            mensaje = 'Ya ha sido asignado un mouse a este CPU.'
                                        } else {
                                            db.query('insert into Mouse values(?,?)', [data.Num_Serie, data.Mouse], async function (err, result) {
                                                if (err) { Errores(err); return callback(err); } // Se hace un control de errores
                                                else {
                                                    if (!result) {
                                                        bandera = false
                                                        mensaje = 'Falló al asignar el mouse, hágalo por separado.'
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                            // DAR DE ALTA TECLADO
                            if (data.Teclado) {
                                db.query('select * from Teclado where Num_Serie = ?', [data.Num_Serie], async function (err, result) {
                                    if (err) { Errores(err); return callback(err); } // Se hace un control de errores
                                    else {
                                        if (result.length > 0) {
                                            bandera = false
                                            mensaje = 'Ya ha sido asignado un teclado a este CPU.'
                                        } else {
                                            db.query('insert into Teclado values(?,?)', [data.Num_Serie, data.Teclado], async function (err, result) {
                                                if (err) { Errores(err); return callback(err); } // Se hace un control de errores
                                                else {
                                                    if (!result) {
                                                        bandera = false
                                                        mensaje = 'Falló al asignar el teclado, hágalo por separado.'
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                            // DAR DE ALTA ACCESORIOS
                            if (data.Accesorio) {
                                db.query('select * from Accesorio where Num_Serie = ?', [data.Num_Serie], async function (err, result) {
                                    if (err) { Errores(err); return callback(err); } // Se hace un control de errores
                                    else {
                                        if (result.length > 0) {
                                            bandera = false
                                            mensaje = 'Ya ha sido asignado un accesorio a este CPU.'
                                        } else {
                                            db.query('insert into Accesorio values(?,?)', [data.Num_Serie, data.Accesorio], async function (err, result) {
                                                if (err) { Errores(err); return callback(err); } // Se hace un control de errores
                                                else {
                                                    if (!result) {
                                                        bandera = false
                                                        mensaje = 'Falló al asignar el accesorio, hágalo por separado.'
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                            // ASIGNAR MONITOR A CPU's
                            if (data.Num_Serie_CPU) {
                                db.query('select Num_Serie from equipo where Num_Serie = ?', data.Num_Serie_CPU, function (err3, res) {
                                    if (err3) { Errores(err3); return callback(err3); } // Se hace un control de errores
                                    if (res.length > 0) {
                                        console.log(res)
                                        console.log(res.Num_Serie)
                                        db.query('insert into monitor values(?,?)', [data.Num_Serie, res[0].Num_Serie], function (err4, res) {
                                            if (err4) { Errores(err4); return callback(err4); } // Se hace un control de errores
                                            if (res) {
                                                bandera = true
                                                mensaje = "Equipo dado de alta."
                                            }
                                        })
                                    } else {
                                        bandera = false
                                        mensaje = "No hay CPU con ese número de serie."
                                    }
                                })
                            }

                            if (bandera) {
                                return callback(null, { type: 'success', message: mensaje });
                            } else {
                                return callback(null, { type: 'failed', message: mensaje });
                            }

                        }
                    }
                });

            } else {
                return callback(null, { type: 'failed', message: 'El equipo no se pudo dar de alta.' })
            }
        }
    });


}

module.exports = addEquipo;