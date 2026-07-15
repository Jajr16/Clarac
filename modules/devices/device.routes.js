// Device Routes
const express = require('express');
const router = express.Router();

const controller = require('./device.controller.js');

const verifyJWT = require('../../middleware/verifyJWT.js');
const attachPermissions = require('../../middleware/attachPermissions.js');
const hasPermissions = require('../../middleware/hasPermissions.js');

const validate = require('../../middleware/validateDTO.js');
const { addDeviceSchema, editDeviceSchema } = require('./device.dto.js');

/**
 * @swagger
 * /devices:
 *   get:
 *     summary: Obtener equipos
 *     tags:
 *       - Equipos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de equipos
 *       403:
 *         description: Sin permisos
 */
router.get('/', verifyJWT, attachPermissions, hasPermissions('EQUIPOS', 'read'), controller.getAllDevices);

/**
 * @swagger
 * /devices/newDev:
 *   post:
 *     summary: Agregar un nuevo equipo
 *     tags:
 *       - Equipos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/New_Device'
 *     responses:
 *       200:
 *         description: Equipo agregado exitosamente
 *       403:
 *         description: Sin permisos
 *       422:
 *         description: Datos de entrada inválidos
 *       409:
 *         description: Ya existe un equipo con ese número de serie
 */
router.post('/', verifyJWT, validate(addDeviceSchema), hasPermissions('EQUIPOS', 'create'), controller.addDevice);

/**
 * @swagger
 * /devices/editDev:
 *   patch:
 *     summary: Editar un equipo existente
 *     tags:
 *       - Equipos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Edit_Device'
 *     responses:
 *       200:
 *         description: Equipo editado exitosamente
 *       403:
 *         description: Sin permisos
 *       422:
 *         description: Datos de entrada inválidos
 */
router.patch('/', verifyJWT, validate(editDeviceSchema), controller.editDevice);

/**
 * @swagger
 * /devices/delDev:
 *   delete:
 *     summary: Eliminar un equipo
 *     tags:
 *       - Equipos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Delete_Device'
 *     responses:
 *       200:
 *         description: Equipo eliminado exitosamente
 *       403:
 *         description: Sin permisos
 *       422:
 *         description: Datos de entrada inválidos
 */
router.delete('/', verifyJWT, controller.deleteDevice);

module.exports = router;