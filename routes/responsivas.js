// routes/responsivas.js

const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const { isAuthenticated, permissions, subperm } = require('../middleware/authMiddleware');

const getResponsives = require('../bin/getResponsives')
const {getEmploys, getUsersAndEmploys} = require('../bin/getEmploys')

router.post('/', isAuthenticated, permissions('RESPONSIVAS'), upload.none(), async (req, res) => {
    getResponsives(req, async (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }

        if (result && result.pdfBuffer) {
            // Enviar el PDF como un blob directamente
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="responsiva.pdf"',
            });
            res.end(result.pdfBuffer);
        } else {
            res.status(400).json({ type: 'error', message: 'No se pudo generar el PDF' });
        }
    });
});

router.get('/getEmploys', isAuthenticated, upload.none(), async (req, res) => {
    getEmploys((err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
})

router.get('/getUsersAndEmploys', isAuthenticated, upload.none(), async (req, res) => {
    getUsersAndEmploys((err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor: ', details: err });
        }
        res.json(result);
    })
})

module.exports = router;