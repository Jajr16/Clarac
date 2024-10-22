
const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig'); 
const isAuthenticated = require('../middleware/authMiddleware')
const { addEmpleado, addUsuario, addPermisos, obtenerEmpleados } = require('../bin/AddRegistros');

// router.post('/', (req, res) => {
//     equipments(req, (err, result) => {
//         if (err) {
//             return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
//         }
//         res.json(result);
//     });
// });

router.post('/new_reg_emp', isAuthenticated, (req, res) => {
    addEmpleado(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

router.post('/new_reg_usu', isAuthenticated, (req, res) => {
    addUsuario(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

router.post('/new_reg_permisos', isAuthenticated, (req, res) => {
    addPermisos(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

// Endpoint que utiliza la función para obtener empleados
router.get('/getEmpleados', (req, res) => {
    obtenerEmpleados((err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }

        // Convertir RowDataPacket a un array simple de objetos JSON
        const empleados = result.map(row => row.Nom);
        console.log("Empleados enviados al frontend:", empleados); // Verificar la estructura
        res.json(empleados); // Enviar los datos al frontend en formato JSON
    });
});



module.exports = router;