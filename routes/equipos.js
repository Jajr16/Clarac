
const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig'); 

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

router.post('/new_eqp', (req, res) => {
    addEquip(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

router.post('/mod_eqp', upload.none(), async (req, res) => {
    modEquip(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

router.post('/del_eqp', upload.none(), async (req, res) => {
    delEquip(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

module.exports = router;