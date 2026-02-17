const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const methodOverride = require('method-override');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler.js');

const swaggerUi = require('swagger-ui-express');
const openApiDocument = require('./config/swagger.js');

const app = express();

const layout = require('express-ejs-layouts');



/* ===================
 *  CONFIGURACIÓN BÁSICA
===================== */

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* ===================
*  MIDDLEWARES GLOBALES
===================== */


app.use(logger('dev'));
app.use(express.json());   
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(layout);

/* ===================
*  RUTAS
===================== */

require('./routes.js')(app);

/* ===================
*  ERRORES
===================== */

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use(errorHandler);

module.exports = app;







// // Constante del login
// const login = require('./bin/login');


// app.use(express.json());


// // Ruta para el login
// app.post('/login', loginLimiter, (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     req.session.errorMessage = 'Por favor, complete todos los campos requeridos.'; // Mensaje de error específico
//     return res.redirect('/login');
//   }

//   login(req, (err, result) => {
//     if (err) {
//       console.err(err)
//       console.log(err)
//       req.session.errorMessage = 'Error en el servidor. Inténtelo de nuevo más tarde.'; // Mensaje de error específico
//       return res.redirect('/');
//     }
//     if (result.type === 'success') {
//       // Autenticación exitosa
//       req.session.userId = req.body.username;
//       req.session.permissions = result.permissions;
//       req.session.area = result.area;
//       return res.json(result);
//     } else {
//       // Error de autenticación
//       return res.status(401).json(result); 
//     }
//   });
// });


// app.get('/', (req, res) => {
//   if (req.session && req.session.userId) {
//     res.render('home', { title: 'CLARAC | Home', layout: 'other_layout' });
//   } else {
//     console.log(req.session)
//     const errorMessage = req.session.errorMessage;
//     req.session.errorMessage = null;
//     res.render('/', { title: 'CLARAC | LogIn', layout: false, errorMessage });
//   }
// });

// app.post('/logout', (req, res) => {
//   req.session.destroy(err => {
//     if (err) {
//       return res.status(500).send('Error al cerrar sesión');
//     }
//     res.clearCookie('connect.sid');
//     res.sendStatus(200);
//   });
// });