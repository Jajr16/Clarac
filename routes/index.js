var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('LogIn', { title: 'CLARAC | LogIn', layout: false, errorMessage: null });
});

module.exports = router;
