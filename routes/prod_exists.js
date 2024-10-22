const express = require('express');
const router = express.Router();

const prodExistConsul = require('../bin/Prod_exist_consul');
const prodExistAdd = require('../bin/AddProd_exist');
const prodExistExtract = require('../bin/ExtractProd_exist')
const isAuthenticated = require('../middleware/authMiddleware')

router.post('/', isAuthenticated, (req, res) => {
    prodExistConsul(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

router.post('/add', isAuthenticated, async (req, res) => {
    prodExistAdd(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

router.post('/extract', isAuthenticated, async (req, res) => {
    prodExistExtract(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result)
    })
})

module.exports = router;