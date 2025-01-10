var express = require('express');
var router = express.Router();
const { isAuthenticated, permissions, valArea, subperm } = require('../middleware/authMiddleware');

/* GET home page */
router.get('/home', isAuthenticated, function (req, res, next) {
  res.render('home', {
    title: 'CLARAC | Home',
    layout: 'other_layout',
    // permissions: getPermissions(req)
  });
});

// Consulta de mobiliario
router.get('/consulMob', isAuthenticated, permissions('MOBILIARIO'), function (req, res, next) {
  res.render('consulMob', {
    title: 'CLARAC | Mobiliario',
    layout: 'other_layout',
    // permissions: getPermissions(req)
  });
});

// Registros
router.get('/registros', isAuthenticated, permissions('USUARIOS', 'EMPLEADOS'), function (req, res, next) {
  res.render('registros', {
    title: 'CLARAC | Registros',
    layout: 'other_layout',
    // permissions: getPermissions(req)
  });
});

// Modificar Registros
router.get('/modReg', isAuthenticated, permissions('USUARIOS', 'EMPLEADOS'), function (req, res, next) {
  res.render('modReg', {
    title: 'CLARAC | Modificar Registros',
    layout: 'other_layout',
    // permissions: getPermissions(req)
  });
});

// Modificar Permisos
router.get('/modPer', isAuthenticated, permissions('USUARIOS'), function (req, res, next) {
  res.render('modPer', {
    title: 'CLARAC | Permisos',
    layout: 'other_layout',
    // permissions: getPermissions(req)
  });
});

// Consulta de productos
router.get('/consulProd', isAuthenticated, permissions('ALMACÉN'), function (req, res, next) {
  res.render('consulProd', {
    title: 'CLARAC | Productos',
    layout: 'other_layout',
    // permissions: getPermissions(req)
  });
});

// Productos existentes
router.get('/productos_exist', isAuthenticated, permissions('ALMACÉN'), function (req, res, next) {
  res.render('productos_exist', {
    title: 'CLARAC | Productos existentes',
    layout: 'other_layout',
    // permissions: getPermissions(req)
  });
});

// Registro de productos sacados
router.get('/registro_PS', isAuthenticated, permissions('ALMACÉN'), function (req, res, next) {
  res.render('registro_PS', {
    title: 'Salida de productos',
    layout: 'other_layout',
    // permissions: getPermissions(req)
  });
});

// Responsivas
router.get('/responsivas', isAuthenticated, permissions('RESPONSIVAS'), function (req, res, next) {
  res.render('responsivas', {
    title: 'CLARAC | Responsivas',
    // permissions: getPermissions(req)
  });
});

// Consulta de Equipos
router.get('/consulEqp', isAuthenticated, permissions('EQUIPOS'), function (req, res, next) {
  res.render('consulEqp', {
    title: 'CLARAC | Equipos',
    layout: 'other_layout',
    // permissions: getPermissions(req)
  });
});

// Peticiones
router.get('/Peticiones', isAuthenticated, permissions('PETICIONES'), function (req, res, next) {
  res.render('peticiones', {
    title: 'CLARAC | Peticiones',
    layout: 'other_layout',
    // permissions: getPermissions(req)
  });
});

// Solicitudes
router.get('/Solicitudes', isAuthenticated, permissions('PETICIONES'), valArea('DIRECCION GENERAL'), function (req, res, next) {
  res.render('solicitudes', {
    title: 'CLARAC | Solicitudes',
    layout: 'other_layout',
    // permissions: getPermissions(req)
  });
});

// Estatus de peticiones
router.get('/petalm', isAuthenticated, permissions('ALMACÉN'), subperm('ALMACÉN', [1,2,3,4]), function (req, res, next) {
  res.render('almacenista', {
    title: 'CLARAC | Estatus de peticiones',
    layout: 'other_layout',
    // permissions: getPermissions(req)
  });
});

module.exports = router;
