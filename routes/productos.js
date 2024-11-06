// routes/productos.js

const express = require('express');
const router = express.Router();

const products = require('../bin/Productos');
const addProduct = require('../bin/AddProductos');
const modProduct = require('../bin/ProductosModify');
const delProduct = require('../bin/deleteProductos');
const { isAuthenticated, subperm } = require('../middleware/authMiddleware');

const upload = require('../config/multerConfig'); 

router.post('/', isAuthenticated, (req, res) => {
    products(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

router.post('/new_prod', isAuthenticated, subperm('ALMACÉN', [1]), (req, res) => {
    addProduct(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

router.post('/mod_prod', isAuthenticated, subperm('ALMACÉN', [3]), upload.none(), async (req, res) => {
    modProduct(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

router.post('/del_prod', isAuthenticated, subperm('ALMACÉN', [2]), upload.none(), async (req, res) => {
    delProduct(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

module.exports = router;