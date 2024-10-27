
const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig'); 
const isAuthenticated = require('../middleware/authMiddleware')
const { addEmpleado, addUsuario, addPermisos, obtenerEmpleados } = require('../bin/AddRegistros');

const prodExistConsul = require('../bin/Prod_exist_consul');
const prodExistAdd = require('../bin/AddProd_exist');
const prodExistExtract = require('../bin/ExtractProd_exist')
// const isAuthenticated = require('../middleware/authMiddleware')

router.post('/', isAuthenticated, (req, res) => {
    prodExistConsul(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

router.post('/add', isAuthenticated, async (req, res) => {
    prodExistAdd(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result);
    });
});

router.post('/extract', isAuthenticated, async (req, res) => {
    prodExistExtract(req, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }
        res.json(result)
    })
})

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