var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/home', function(req, res, next) {
  res.render('home', { title: 'CLARAC | Home', layout: 'other_layout'  });
});

// Consulta de mobiliario
router.get('/consulMob', function (req, res, next) {
  res.render('consulMob', { title: 'Consultar Mobiliario', layout: 'other_layout' });
});

// Consulta de productos
router.get('/consulProd', function (req, res, next) {
  res.render('consulProd', { title: 'Consultar Productos', layout: 'other_layout' });
});

module.exports = router;