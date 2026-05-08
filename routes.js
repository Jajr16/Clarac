module.exports = (app) => {
    app.use('/', require('./modules/login/login.route'));
    app.use('/users', require('./modules/users/users.route'));
    app.use('/devices', require('./modules/devices/device.routes'));
    app.use('/furnitures', require('./modules/furniture/furniture.routes'));
    // app.use('/mobiliario', require('./modules/mobiliario/mobiliario.routes'));
    // app.use('/producto', require('../routes/productos'));
    // app.use('/prod_exts', require('../routes/prod_exists'));
    // app.use('/prods_sacados', require('../routes/prod_sacados'));
    // app.use('/responsiva', require('./modules/responsivas/responsivas.routes'));
    // app.use('/excels', require('../routes/excels'));
    // app.use('/registro', require('../routes/registros'));
    // app.use('/pet', require('../routes/peticiones'));
}