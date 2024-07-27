const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const { body, validationResult } = require('express-validator');
const createError = require('http-errors');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const { MongoClient, ObjectId, GridFSBucket } = require('mongodb');
const methodOverride = require('method-override');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const login = require('./bin/login');
const furnitures = require('./bin/Mobiliario');
const addFurnit = require('./bin/AddMobiliario');
const modFurnit = require('./bin/MobiliarioModify');

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

// Configurar express-session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 3600000
  }
}));

// Configurar limitador de intentos de inicio de sesión
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Demasiados intentos de inicio de sesión, por favor inténtelo de nuevo más tarde.'
});

// Conexión a MongoDB
const url = 'mongodb://localhost:27017/Clarac';
const conn = mongoose.createConnection(url);

let gfsBucket;

conn.once('open', () => {
  console.log('Conexión a MongoDB establecida.');
  gfsBucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });
  console.log('GridFSBucket inicializado y colección "uploads" seleccionada.');
});

conn.on('error', (err) => {
  console.error('Error de conexión a MongoDB:', err);
});

// Configuración de GridFsStorage
const storage = new GridFsStorage({
  url: url,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          console.error('Error generating random bytes:', err);
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        console.log('File info:', fileInfo);  // Logging fileInfo for debugging
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

// Rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post('/Mobiliario', (req, res) => {
  furnitures(req, (err, result) => {
    if (err) {
      return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
    }
    res.json(result);
  });
});

app.post('/new_mob', (req, res) => {
  addFurnit(req, (err, result) => {
    if (err) {
      return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
    }
    res.json(result);
  });
});

app.post('/mod_mob', (req, res) => {
  modFurnit(req, (err, result) => {
    if (err) {
      return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
    }
    res.json(result);
  });
});

// Ruta para subir archivos
app.post('/users/upload', (req, res, next) => {
  console.log('Entrando a la ruta /users/upload');
  next();
}, upload.single('file'), (req, res) => {
  console.log('Después de multer');
  if (!req.file) {
    console.log('No file uploaded');
    return res.status(400).json({ type: 'error', message: 'No file uploaded' });
  }
  res.json({ file: req.file });
});

// Get Images
app.get('/users/files', async (req, res) => {
  if (!gfsBucket) {
    console.log('gfsBucket no está inicializado');
    return res.status(500).json({ err: 'GridFSBucket no está inicializado' });
  }

  console.log('Obteniendo archivos de GridFS...');

  try {
    const files = await gfsBucket.find().toArray();

    console.log('Archivos obtenidos:', files);
    if (!files || files.length === 0) {
      console.log('No hay archivos guardados');
      return res.status(404).json({ err: 'No hay archivos guardados' });
    }

    console.log('Devolviendo lista de archivos');
    res.json(files);

  } catch (err) {
    console.error('Error al obtener archivos:', err);
    res.status(500).json({ err: 'Error al obtener archivos' });
  }
});


// Get one file
app.get('/users/files/:filename', async (req, res) => {
  if (!gfsBucket) {
    console.log('gfsBucket no está inicializado');
    return res.status(500).json({ err: 'GridFSBucket no está inicializado' });
  }

  console.log('Obteniendo archivo...')

  try {
    const file = await gfsBucket.find({ filename: req.params.filename }).toArray();

    if (!file || file.length === 0) {
      console.log('No se encontró el archivo');
      return res.status(404).json({ err: 'No se encontró el archivo' });
    }

    console.log('Archivo encontrado...', file);
    res.json(file);

  } catch (err) {
    console.error('Error al obtener el archivo: ', err);
    res.status(500).json({ err: 'Error al obtener archivos' });
  }
});

// Display Images
app.get('/users/image/:filename', async (req, res) => {
  if (!gfsBucket) {
    console.log('gfsBucket no está inicializado');
    return res.status(500).json({ err: 'GridFSBucket no está inicializado' });
  }

  console.log('Obteniendo archivo de GridFS...', req.params.filename);

  try {
    const file = await gfsBucket.find({ filename: req.params.filename }).toArray();

    if (!file || file.length === 0) {
      console.log('No se encontró el archivo');
      return res.status(404).json({ err: 'No se encontró el archivo' });
    }

    const fileData = file[0];

    if (fileData.contentType === 'image/jpeg' || fileData.contentType === 'image/png' || fileData.contentType === 'image/jpg') {
      console.log('Es una imagen, devolviendo el stream');
      const readstream = gfsBucket.openDownloadStreamByName(fileData.filename);
      readstream.pipe(res);
    } else {
      console.log('El archivo no es una imagen');
      res.status(404).json({ err: 'No es una imagen' });
    }

  } catch (err) {
    console.error('Error al obtener el archivo: ', err);
    res.status(500).json({ err: 'Error al obtener archivos' });
  }
});

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
