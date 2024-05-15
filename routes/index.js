var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('LogIn', { title: 'CLARAC | LogIn', layout: false  });
});

// Consulta de mobiliario
router.get('/consulMob2', function (req, res, next) {
  res.render('consulMob2', { title: 'Consultar Mobiliario', layout: 'other_layout' });
});

module.exports = router;
