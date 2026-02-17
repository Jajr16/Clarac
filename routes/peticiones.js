const express = require('express');
const router = express.Router();

const petAdd = require('../backend/bin/AddPet');
const consulStatus = require('../backend/bin/Status');
const consulSol = require('../backend/bin/Solicitudes');
const deletePeti = require('../backend/bin/DeletePeti');
const confirmPet = require('../backend/bin/ConfirmacionPet');
const confirmPetDir = require('../backend/bin/confirmPetDir');
const viewStatus = require('../backend/bin/viewStatusDir');
const consulHistory = require('../backend/bin/viewHistory');
const viewStatusAlmacen = require('../backend/bin/viewStatusAlmacen');
const viewHistoryAlmacenista = require('../backend/bin/viewHistoryAlmacenista');
const ConfirmAlmacen = require('../backend/bin/ConfirmAlmacen');
const { isAuthenticated, subperm, valArea } = require('../frontend/middleware/authMiddleware');

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

router.post('/cancelar', isAuthenticated, subperm('PETICIONES', [1]), async (req, res) => {
    deletePeti(req, (err, result) => {
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