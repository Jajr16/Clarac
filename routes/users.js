var express = require('express');
var router = express.Router();
const isAuthenticated = require('../middleware/authMiddleware')

/* GET users listing. */
router.get('/home', isAuthenticated, function (req, res, next) {
  res.render('home', { title: 'CLARAC | Home', layout: 'other_layout' });
});

// Consulta de mobiliario
router.get('/consulMob', isAuthenticated, function (req, res, next) {
  res.render('consulMob', { title: 'Consultar Mobiliario', layout: 'other_layout' });
});

// Registros
router.get('/registros', isAuthenticated, function (req, res, next) {
  res.render('registros', { title: 'Registros', layout: 'other_layout' });
});

// Consulta de productos
router.get('/consulProd', isAuthenticated, function (req, res, next) {
  res.render('consulProd', { title: 'Consultar Productos', layout: 'other_layout' });
});

// Productos existentes
router.get('/productos_exist', function (req, res, next) {
  res.render('productos_exist', { title: 'Productos existentes', layout: 'other_layout' });
});

// Responsivas
router.get('/responsivas', isAuthenticated, function (req, res, next) {
  res.render('responsivas', { title: 'Responsivas' });
});

// Consulta de Equipos
router.get('/consulEqp', isAuthenticated, function (req, res, next) {
  res.render('consulEqp', { title: 'Consultar Equipos', layout: 'other_layout' });
});

// Consulta de Equipos
router.get('/Peticiones', isAuthenticated, function (req, res, next) {
  res.render('peticiones', { title: 'Peticiones | CLARAC', layout: 'other_layout' });
});

module.exports = router;