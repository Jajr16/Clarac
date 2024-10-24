const express = require('express');
const router = express.Router();

const petAdd = require('../bin/AddPet');
const isAuthenticated = require('../middleware/authMiddleware')

router.post('/addPet', isAuthenticated, async (req, res) => {
    petAdd(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});


module.exports = router;