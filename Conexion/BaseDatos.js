const mysql = require('mysql2');

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'n0m3l0',//n0m3l0 //Bocchi26##
    database: 'Inventarios',
    connectTimeout: 10000
});
// Conexión a la base de datos
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conexión a la base de datos establecida');
});

module.exports = db;