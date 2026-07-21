// Warehouse routes
const express = require('express');
const router = express.Router();

const controller = require('./warehouse.controller')

const verifyJWT = require('../../middleware/verifyJWT');
const attachPermissions = require('../../middleware/attachPermissions');
const hasPermissions = require('../../middleware/hasPermissions');

const validate = require('../../middleware/validateDTO');


/**
 * @swagger
 * /api/warehouse:
 *   get:
 *     summary: Obtener inventario del almacén
 *     tags:
 *       - Almacén
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de almacén
 *       403:
 *         description: Sin permisos
 */
router.get('/', verifyJWT, attachPermissions, hasPermissions('ALMACEN', 'read'), controller.getWarehouse);

/**
 * @swagger
 * /api/warehouse:
 *   post:
 *     summary: Agregar producto al almacén
 *     tags:
 *       - Almacén
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              $ref: '#/components/schemas/New_Product'
 *     responses:
 *       200:
 *         description: Lista de almacén
 *       403:
 *         description: Sin permisos
 */
router.post('/', verifyJWT, attachPermissions, hasPermissions('ALMACEN', 'create'), controller.addProduct);

/**
 * @swagger
 * /api/warehouse:
 *   patch:
 *     summary: Actualizar producto del almacén
 *     tags:
 *      - Almacén
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Update_Product'
 *     responses:
 *       200:
 *        description: Producto editado exitosamente
 *       403:
 *         description: Sin permisos
 *       422:
 *         description: Datos de entrada inválidos
 *       
 */

module.exports = router;