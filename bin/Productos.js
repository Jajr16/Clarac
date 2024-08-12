var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')

function consulprod(req, callback) {
    const { username } = req.body;

    db.query('SELECT Área FROM empleado INNER JOIN usuario ON empleado.Num_emp = usuario.Num_emp WHERE usuario = ?', [username], function (err, res) {
        if (err) {
            Errores(err);
            return callback(err);
        }

        if (res.length > 0) { // Si se encontró el usuario
            if (!(res[0].Área === 'SISTEMAS')) {
                db.query('SELECT * FROM almacen order by eliminado', function (err, result) {
                    if (err) {
                        Errores(err);
                        return callback(err);
                    }

                    const dataToSend = result.map(item => ({
                        Cod_Barras: item.Cod_Barras,
                        Categoria: item.Categoria,
                        Articulo: item.Articulo,
                        Marca: item.Marca,
                        Descripcion: item.Descripcion,
                        Unidad: item.Unidad,
                        Existencia: item.Existencia,
                        Eliminado: item.eliminado
                    }));
                    return callback(null, dataToSend);
                });
            } else {
                db.query('SELECT * FROM almacen order by eliminado', function (err, result) {
                    if (err) {
                        Errores(err);
                        return callback(err);
                    }

                    const dataToSend = result.map(item => ({
                        Cod_Barras: item.Cod_Barras,
                        Categoria: item.Categoria,
                        Articulo: item.Articulo,
                        Marca: item.Marca,
                        Descripcion: item.Descripcion,
                        Unidad: item.Unidad,
                        Existencia: item.Existencia,
                        Eliminado: item.eliminado
                    }));
                    return callback(null, dataToSend);
                });
            }
        } else {
            return callback(null, []); // Si no se encontró el usuario, devolver un arreglo vacío
        }
    });
}

module.exports = consulprod;
