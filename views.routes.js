const express = require('express');
var router = express.Router()
const authView = require("./middleware/authView.js")
const attachPermissions = require('./middleware/attachPermissions.js');
const hasPermissions = require('./middleware/hasPermissions.js');

router.get('/', function (req, res) {
    res.render('LogIn', { title: 'CLARAC | LogIn', layout: false, errorMessage: null });
});

router.get('/users/home', authView, attachPermissions, function (req, res) {
    res.render('Home', { title: 'CLARAC | Home', layout: 'other_layout', user: req.user });
});

router.get('/users/warehouse', authView, attachPermissions, hasPermissions('ALMACEN', 'read'), function (req, res) {
    res.render('consulProd', { title: 'CLARAC | Almacén de Productos', layout: 'other_layout', user: req.user})
})

module.exports = router