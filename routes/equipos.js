
const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig'); 
const { isAuthenticated, subperm } = require('../middleware/authMiddleware');


const equipments = require('../bin/Equipos');
const addEquip = require('../bin/AddEquipos');
const modEquip = require('../bin/EquiposModify');
const delEquip = require('../bin/deleteEquipos');

router.post('/', (req, res) => {
    equipments(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

router.post('/new_eqp', isAuthenticated, subperm('EQUIPOS', [1]), (req, res) => {
    addEquip(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

router.post('/mod_eqp', isAuthenticated, subperm('EQUIPOS', [3]), upload.none(), async (req, res) => {
    modEquip(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

router.post('/del_eqp', isAuthenticated, subperm('EQUIPOS', [2]), upload.none(), async (req, res) => {
    delEquip(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

module.exports = router;