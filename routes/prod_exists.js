const express = require('express');
const router = express.Router();

const Prod_exist_consul = require('../bin/Prod_exist_consul');
const Prod_exist_add = require('../bin/Prod_exist_add');
const isAuthenticated = require('../middleware/authMiddleware')

const upload = require('../config/multerConfig'); 

router.post('/', isAuthenticated, (req, res) => {
    Prod_exist_consul(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

router.post('/Prod_exist_add', isAuthenticated, (req, res) => {
    Prod_exist_add(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

module.exports = router;