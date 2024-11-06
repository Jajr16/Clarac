const express = require('express');
const router = express.Router();

const petAdd = require('../bin/AddPet');
const consulStatus = require('../bin/Status');
const consulSol = require('../bin/Solicitudes');
const confirmPet = require('../bin/ConfirmacionPet');
const confirmPetDir = require('../bin/confirmPetDir');
const viewStatus = require('../bin/viewStatusDir');
const consulHistory = require('../bin/viewHistory');
const viewStatusAlmacen = require('../bin/viewStatusAlmacen');
const viewHistoryAlmacenista = require('../bin/viewHistoryAlmacenista');
const ConfirmAlmacen = require('../bin/ConfirmAlmacen');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post('/addPet', isAuthenticated, async (req, res) => {
    petAdd(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

router.post('/status', isAuthenticated, async (req, res) => {
    consulStatus(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

router.post('/Solicitante', isAuthenticated, async (req, res) => {
    confirmPet(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    })
})

router.post('/consulSol', isAuthenticated, async (req, res) => {
    consulSol(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    })
})

router.post('/confirmPetDir', isAuthenticated, async (req, res) => {
    confirmPetDir(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    })
})

router.post('/viewStatus', isAuthenticated, async (req, res) => {
    viewStatus(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    })
})

router.post('/viewHistory', isAuthenticated, async (req, res) => {
    consulHistory(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    })
})

router.post('/viewStatusAlmacen', isAuthenticated, async (req, res) => {
    viewStatusAlmacen(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    })
})

router.post('/viewHistoryAlmacenista', isAuthenticated, async (req, res) => {
    viewHistoryAlmacenista(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    })
})

router.post('/ConfirmAlmacen', isAuthenticated, async (req, res) => {
    ConfirmAlmacen(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    })
})

module.exports = router;