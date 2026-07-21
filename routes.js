const viewsRouter = require('./views.routes.js');

module.exports = (app) => {
    /* 
        ===================
            FRONTEND
        ===================
    */
    app.use('/', viewsRouter);

    /* 
        ===================
            BACKEND
        ===================
    */
    app.use('/api', require('./modules/login/login.route'));
    app.use('/api/users', require('./modules/users/users.route'));
    app.use('/api/devices', require('./modules/devices/device.routes'));
    app.use('/api/furnitures', require('./modules/furniture/furniture.routes'));
    app.use('/api/warehouse', require('./modules/warehouse/warehouse.routes.js'));
    // app.use('/mobiliario', require('./modules/mobiliario/mobiliario.routes'));
    // app.use('/producto', require('../routes/productos'));
    // app.use('/prod_exts', require('../routes/prod_exists'));
    // app.use('/prods_sacados', require('../routes/prod_sacados'));
    // app.use('/responsiva', require('./modules/responsivas/responsivas.routes'));
    // app.use('/excels', require('../routes/excels'));
    // app.use('/registro', require('../routes/registros'));
    // app.use('/pet', require('../routes/peticiones'));
}