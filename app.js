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

require('dotenv').config();

const equipoRoutes = require('./routes/equipos')
const mobiliarioRoutes = require('./routes/mobiliario')
const productoRoutes = require('./routes/productos')
const responsivasRoutes = require('./routes/responsivas')
const excelsRoutes = require('./routes/excels')

// Constante del login
const login = require('./bin/login');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const layout = require('express-ejs-layouts');

const app = express();

// Set view engine and views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layout);
app.use(methodOverride('_method'));

app.use('/equipo', equipoRoutes);
app.use('/mobiliario', mobiliarioRoutes);
app.use('/producto', productoRoutes);
app.use('/responsiva', responsivasRoutes);
app.use('/excels', excelsRoutes);

// Configurar express-session
app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

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
    return res.status(400).json({ errors: errors.array() });
  }

  login(req, (err, result) => {
    if (err) {
      return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
    }
    res.json(result);
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