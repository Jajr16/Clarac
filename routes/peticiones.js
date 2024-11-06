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
const { isAuthenticated, subperm, valArea } = require('../middleware/authMiddleware');

router.post('/addPet', isAuthenticated, subperm('PETICIONES', [1]), async (req, res) => {
    petAdd(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

router.post('/status', isAuthenticated, subperm('PETICIONES', [1]), async (req, res) => {
    consulStatus(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

router.post('/Solicitante', isAuthenticated, subperm('PETICIONES', [1]), async (req, res) => {
    confirmPet(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    })
})

router.post('/consulSol', isAuthenticated, subperm('PETICIONES', [1]), valArea('DIRECCION GENERAL'), async (req, res) => {
    consulSol(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    })
})

router.post('/confirmPetDir', isAuthenticated, subperm('PETICIONES', [1]), valArea('DIRECCION GENERAL'), async (req, res) => {
    confirmPetDir(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    })
})

router.post('/viewStatus', isAuthenticated, subperm('PETICIONES', [1]), valArea('DIRECCION GENERAL'), async (req, res) => {
    viewStatus(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    })
})

router.post('/viewHistory', isAuthenticated, subperm('PETICIONES', [1]), valArea('DIRECCION GENERAL'), async (req, res) => {
    consulHistory(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    })
})

router.post('/viewStatusAlmacen', isAuthenticated, subperm('ALMACÉN', [1,2,3,4]), async (req, res) => {
    viewStatusAlmacen(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    })
})

router.post('/viewHistoryAlmacenista', isAuthenticated, subperm('ALMACÉN', [1,2,3,4]), async (req, res) => {
    viewHistoryAlmacenista(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    })
})

router.post('/ConfirmAlmacen', isAuthenticated, subperm('ALMACÉN', [1,2,3,4]), async (req, res) => {
    ConfirmAlmacen(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    })
})

module.exports = router;