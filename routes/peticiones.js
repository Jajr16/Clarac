const express = require('express');
const router = express.Router();

const petAdd = require('../bin/AddPet');
const consulStatus = require('../bin/Status');
const consulSol = require('../bin/Solicitudes');
const confirmPet = require('../bin/ConfirmacionPet');
const confirmPetDir = require('../bin/confirmPetDir');
const isAuthenticated = require('../middleware/authMiddleware')

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


module.exports = router;