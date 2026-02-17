const express = require('express');
const router = express.Router();

const prodSacConsul = require('../backend/bin/prod_sac_consul');
const { isAuthenticated } = require('../frontend/middleware/authMiddleware');

router.post('/', isAuthenticated, (req, res) => {
    prodSacConsul(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

module.exports = router;