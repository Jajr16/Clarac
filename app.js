const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { body, validationResult } = require('express-validator');
const createError = require('http-errors');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const methodOverride = require('method-override');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const MySQLStore = require('express-mysql-session')(session);
const db = require('./Conexion/BaseDatos')
const sessionMiddleware = require('./middleware/sessionMiddleware');
const { isAuthenticated } = require('./middleware/authMiddleware');

require('dotenv').config();

const equipoRoutes = require('./routes/equipos')
const mobiliarioRoutes = require('./routes/mobiliario')
const productoRoutes = require('./routes/productos')
const prodExistsRoutes = require('./routes/prod_exists')
const responsivasRoutes = require('./routes/responsivas')
const excelsRoutes = require('./routes/excels')
const registrosRoutes = require('./routes/registros')
const peticiones = require('./routes/peticiones')

// Constante del login
const login = require('./bin/login');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const layout = require('express-ejs-layouts');

const app = express();
app.use(bodyParser.json());

// Set view engine and views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configurar express-session
const sessionStore = new MySQLStore({}, db);

app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layout);
app.use(methodOverride('_method'));
app.use(sessionMiddleware);

app.use((req, res, next) => {
  res.locals.area = getArea(req);
  res.locals.permissions = getPermissions(req);
  next();
});

function getArea(req) {
  return req.session.area || {};
}

function getPermissions(req) {
  return req.session.permissions || {};
}

// Configurar limitador de intentos de inicio de sesión
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Demasiados intentos de inicio de sesión, por favor inténtelo de nuevo más tarde.'
});

// Rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Ruta para el login
app.post('/login', loginLimiter, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.session.errorMessage = 'Por favor, complete todos los campos requeridos.'; // Mensaje de error específico
    return res.redirect('/login');
  }

  login(req, (err, result) => {
    if (err) {
      console.err(err)
      console.log(err)
      req.session.errorMessage = 'Error en el servidor. Inténtelo de nuevo más tarde.'; // Mensaje de error específico
      return res.redirect('/');
    }
    if (result.type === 'success') {
      // Autenticación exitosa
      req.session.userId = req.body.username;
      req.session.permissions = result.permissions;
      req.session.area = result.area;
      return res.json(result);
    } else {
      // Error de autenticación
      return res.status(401).json(result); 
    }
  });
});

app.use(isAuthenticated);
app.use('/equipo', equipoRoutes);
app.use('/mobiliario', mobiliarioRoutes);
app.use('/producto', productoRoutes);
app.use('/prod_exts', prodExistsRoutes);
app.use('/responsiva', responsivasRoutes);
app.use('/excels', excelsRoutes);
app.use('/registro', registrosRoutes);
app.use('/pet', peticiones);

app.get('/', (req, res) => {
  if (req.session && req.session.userId) {
    res.render('home', { title: 'CLARAC | Home', layout: 'other_layout' });
  } else {
    console.log(req.session)
    const errorMessage = req.session.errorMessage;
    req.session.errorMessage = null;
    res.render('/', { title: 'CLARAC | LogIn', layout: false, errorMessage });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.clearCookie('connect.sid');
    res.sendStatus(200);
  });
});

// Manejo de errores
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;