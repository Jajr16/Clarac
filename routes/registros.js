
const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig'); 
const { isAuthenticated } = require('../middleware/authMiddleware');
const { addEmpleado, addUsuario, addPermisos, obtenerRegistrosUsuarios,
    obtenerRegistrosEmpleados, obtenerPermisosPorUsuario, obtenerEmpleados,
    modifyRegUsu, modifyRegemp, modifyRegPer} = require('../bin/ModRegistros');

router.get('/', (req, res) => {
    obtenerRegistrosUsuarios((err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }

        // Convertir RowDataPacket a un array simple de objetos JSON
        const empleados = result.map(row => ({
            numemp: row.numemp,
            nombre: row.nombre, 
            usuario: row.usuario || '-',
            password: row.password
        }));

        res.json(empleados); 
    });
});

router.get('/getRegistrosPermisos', (req, res) => {
    const usuario = req.query.usuario;
    if (!usuario) {
        return res.status(400).json({ type: 'error', message: 'Usuario no especificado' });
    }

    obtenerPermisosPorUsuario(usuario, (err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }

        res.json(result);
    });
});

router.get('/registro/emp', (req, res) => {
    obtenerRegistrosEmpleados((err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }

        // Convertir RowDataPacket a un array simple de objetos JSON
        const empleados = result.map(row => ({
            numemp: row.numemp,
            nombre: row.nombre, 
            area: row.area
        }));

        res.json(empleados); 
    });
});

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
        res.json(empleados); // Enviar los datos al frontend en formato JSON
    });
});

// Endpoint que utiliza la función para obtener empleados
router.get('/getRegistrosUsuarios', (req, res) => {
    obtenerRegistrosUsuarios((err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }

        // Convertir RowDataPacket a un array simple de objetos JSON
        const empleados = result.map(row => ({
            numemp: row.numemp,
            nombre: row.nombre, 
            usuario: row.usuario || '-',
            password: row.password
        }));
        
        res.json(empleados); 
    });
});

// Endpoint que utiliza la función para obtener empleados
router.get('/getRegistrosEmpleados', (req, res) => {
    obtenerRegistrosEmpleados((err, result) => {
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
        }

        // Convertir RowDataPacket a un array simple de objetos JSON
        const empleados = result.map(row => ({
            numemp: row.numemp,           
            nombre: row.nombre, 
            area: row.area
        }));

        // console.log("Empleados enviados al frontend:", empleados); 
        res.json(empleados); 
    });
});

router.post('/mod_reg_emp', isAuthenticated, upload.none(), (req, res) => {
    modifyRegemp(req, res);
});

router.post('/mod_reg_usu', isAuthenticated, upload.none(), (req, res) => {
    modifyRegUsu(req, res);
});

router.post('/mod_reg_per', isAuthenticated, upload.none(), (req, res) => {
    modifyRegPer(req, res);
});

module.exports = router;