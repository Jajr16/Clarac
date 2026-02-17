// Login Route
var express = require('express');
var router = express.Router();
const rateLimit = require('express-rate-limit');

const validate = require('../../middleware/validateDTO.js');
const { loginSchema } = require('./login.dto.js');

const loginController = require('./login.controller.js');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Demasiados intentos de inicio de sesión, por favor inténtelo de nuevo más tarde.'
});

/**
 * @swagger
 * /:
 *   post:
 *     summary: Iniciar sesión
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/login'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 *       400:
 *         description: Datos incompletos
 */
router.post(
  '/',
  loginLimiter,
  validate(loginSchema),
  loginController.login
);


router.get('/', function (req, res) {
  res.render('LogIn', { title: 'CLARAC | LogIn', layout: false, errorMessage: null });
});

module.exports = router;
