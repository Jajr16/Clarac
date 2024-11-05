var express = require('express');
var router = express.Router();
const isAuthenticated = require('../middleware/authMiddleware');

// Middleware para pasar permisos a todas las vistas
router.use(isAuthenticated, (req, res, next) => {
  res.locals.permissions = req.session.permissions || {}; // Pasa permisos a las vistas
  next();
});

/* GET users listing. */
router.get('/home', function (req, res, next) {
  res.render('home', { title: 'CLARAC | Home', layout: 'other_layout' });
});

// Consulta de mobiliario
router.get('/consulMob', function (req, res, next) {
  res.render('consulMob', { title: 'Consultar Mobiliario', layout: 'other_layout' });
});

// Registros
router.get('/registros', function (req, res, next) {
  res.render('registros', { title: 'Registros', layout: 'other_layout' });
});

// Modificar Registros
router.get('/modReg', function (req, res, next) {
  res.render('modReg', { title: 'Modificar Registros', layout: 'other_layout' });
});

// Modificar Permisos
router.get('/modPer', function (req, res, next) {
  res.render('modPer', { title: 'Modificar Permisos', layout: 'other_layout' });
});

// Consulta de productos
router.get('/consulProd', function (req, res, next) {
  res.render('consulProd', { title: 'Consultar Productos', layout: 'other_layout' });
});

// Productos existentes
router.get('/productos_exist', function (req, res, next) {
  res.render('productos_exist', { title: 'Productos existentes', layout: 'other_layout' });
});

// Responsivas
router.get('/responsivas', function (req, res, next) {
  res.render('responsivas', { title: 'Responsivas', layout: 'other_layout' });
});

// Consulta de Equipos
router.get('/consulEqp', function (req, res, next) {
  res.render('consulEqp', { title: 'Consultar Equipos', layout: 'other_layout' });
});

// Peticiones
router.get('/Peticiones', function (req, res, next) {
  res.render('peticiones', { title: 'Peticiones | CLARAC', layout: 'other_layout' });
});

// Solicitudes
router.get('/Solicitudes', function (req, res, next) {
  res.render('solicitudes', { title: 'Solicitudes | CLARAC', layout: 'other_layout' });
});

// Estatus de peticiones
router.get('/Petalm', function (req, res, next) {
  res.render('almacenista', { title: 'Estatus de peticiones | CLARAC', layout: 'other_layout' });
});

module.exports = router;
