var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')

function prodExistAdd(req, callback) {

    const data = req.body;
    console.log(data)

    // // Verificar si la factura ya existe en la base de datos
    // db.query('select*from facturas_almacen where Num_Fact = ?', [data.NumFactura], function (err, result) {

    //     if (err) {

    //         Errores(err);
    //         return callback(err);

    //     } else {

    //         if (result.length > 0) { // Si se encontró algo

    //             // Verificar si la relación entre producto y factura ya existe
    //             db.query('select*from Factus_Productos where Nfactura = ? and Cod_Barras = ?', [data.NumFactura, data.Cod_Barras], function (err1, result1) {
                    
    //                 if (err1) {

    //                     Errores(err1);
    //                     return callback(err1);

    //                 } else {

    //                     if (result1.length > 0) {

    //                         // Enviar mensaje al cliente si la factura ya está registrada para este producto
    //                         return callback(null, { type: 'RespDelProdExists', message: 'Factura registrada anteriormente para este producto.' });
                        
    //                     } else {

    //                         // Agregar la relación entre producto y factura
    //                         db.query('insert into Factus_Productos values (?,?,?,?)', [data.Cod_Barras, data.NumFactura, data.Existencia, data.FecAct], function (err2, result2) {

    //                             if (err2) {

    //                                 Errores(err2);
    //                                 return callback(err2);

    //                             } else {

    //                                 if (result2) {

    //                                     // Actualizar la existencia de productos
    //                                     db.query('update almacen set Existencia = ? where Cod_Barras = ?', [(parseInt(data.dataOldExis) + parseInt(data.Existencia)), data.Cod_Barras], function (err3, result3) {

    //                                         if (err3) {

    //                                             Errores(err3);
    //                                             return callback(err3);

    //                                         } else {
                                                
    //                                             if (result3.affectedRows > 0) { // Si se encontró un producto para actualizar

    //                                                 return callback(null, { type: 'RespDelProdExists', message: 'Existencia de producto actualizada con éxito.' });

    //                                             } else {

    //                                                 return callback(null, { type: 'RespDelProdExists', message: 'No se pudo actualizar la existencia del producto.' });
                                                    
    //                                             }
    //                                         }
    //                                     });

    //                                 } else {

    //                                     return callback(null, { type: 'RespDelProdExists', message: 'No se pudo agregar la factura del producto. (1)' });
                                    
    //                                 }
    //                             }
    //                         });
    //                     }
    //                 }
    //             });

    //         } else {

    //             // Agregar una nueva factura y la relación entre producto y factura
    //             db.query('insert into facturas_almacen values (?,?,?)', [data.NumFactura, data.FechaFac, data.Proveedor], function (err1, result1) {
                    
    //                 if (err1) {

    //                     Errores(err1);
    //                     return callback(err1);

    //                 } else {

    //                     if (result1) {

    //                         db.query('insert into Factus_Productos values (?,?,?,?)', [data.Cod_Barras, data.NumFactura, data.Existencia, data.FecAct], function (err2, result2) {

    //                             if (result2) {

    //                                 db.query('update almacen set Existencia = ? where Cod_Barras = ?', [(parseInt(data.dataOldExis) + parseInt(data.Existencia)), data.Cod_Barras], function (err3, result3) {

    //                                     if (err2) {

    //                                         Errores(err3);
    //                                         return callback(err3);

    //                                     } else {

    //                                         if (result3.affectedRows > 0) {

    //                                             return callback(null, { type: 'RespDelProdExists', message: 'Existencia de producto actualizada con éxito.' });

    //                                         } else {

    //                                             return callback(null, { type: 'RespDelProdExists', message: 'No se pudo actualizar la existencia del producto.' });

    //                                         }
    //                                     }
    //                                 });
    //                             } else {

    //                                 return callback(null, { type: 'RespDelProdExists', message: 'No se pudo agregar la factura del producto. (2)' });
    //                             }
    //                         });

    //                     } else {

    //                         return callback(null, { type: 'RespDelProdExists', message: 'No se pudo agregar la factura.' });

    //                     }
    //                 }
    //             });
    //         }
    //     }
    // });
}

module.exports = prodExistAdd;
