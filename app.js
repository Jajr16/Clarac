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

mongoose.connect(url)
  .then(() => {
    console.log('Conexión a MongoDB establecida.');
  })
  .catch(err => {
    console.error('Error de conexión a MongoDB:', err);
  });

let gfsBucket;

conn.once('open', () => {
  console.log('Conexión a MongoDB establecida.');
  gfsBucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });
  console.log('GridFSBucket inicializado y colección "uploads" seleccionada.');
});

conn.on('error', (err) => {
  console.error('Error de conexión a MongoDB:', err);
});

function customId(req) {
  const abc1 = 'abcdefghij';
  const abc2 = 'klmnñopqrs';
  const abc3 = 'tuvwxyzABC';
  const abc4 = 'DEFGHIJKLM';
  const abc5 = 'NÑOPQRSTUV';
  const abc6 = 'WXYZ123456';
  const abc7 = '7890';
  let customId = `${req.body.articulo}A${req.body.descripcion}A${req.body.user}`;
  console.log(customId)
  let count = 0;

  const getHexEquivalent = (char) => {
    if (abc1.includes(char)) return abc1.indexOf(char).toString();
    if (abc2.includes(char)) return abc2.indexOf(char).toString();
    if (abc3.includes(char)) return abc3.indexOf(char).toString();
    if (abc4.includes(char)) return abc4.indexOf(char).toString();
    if (abc5.includes(char)) return abc5.indexOf(char).toString();
    if (abc6.includes(char)) return abc6.indexOf(char).toString();
    if (abc7.includes(char)) return abc7.indexOf(char).toString();
    return '1';
  };

  // Replace invalid characters and add indices
  let newId = '';
  for (let i = 0; i < customId.length; i++) {
    const char = customId[i];
    if (/[0-9a-fA-F]/.test(char)) {
      newId += char;
    } else {
      newId += getHexEquivalent(char);
    }
  }

  // Extend to 24 characters if necessary
  while (newId.length < 24) {
    const char = newId[count];
    if (abc1.indexOf(char) !== -1) {
      newId = newId.concat(abc1.indexOf(char));
    } else if (abc2.indexOf(char) !== -1) {
      newId = newId.concat(abc2.indexOf(char));
    } else if (abc3.indexOf(char) !== -1) {
      newId = newId.concat(abc3.indexOf(char));
    } else if (abc4.indexOf(char) !== -1) {
      newId = newId.concat(abc4.indexOf(char));
    } else if (abc5.indexOf(char) !== -1) {
      newId = newId.concat(abc5.indexOf(char));
    } else if (abc6.indexOf(char) !== -1) {
      newId = newId.concat(abc6.indexOf(char));
    } else if (abc7.indexOf(char) !== -1) {
      newId = newId.concat(abc7.indexOf(char));
    } else {
      newId = newId.concat(1);
    }
    count = count + 1;
  }

  // Ensure all characters are uppercase
  customId = newId.toUpperCase();

  console.log(customId);
  return customId
}

// Configuración de GridFsStorage
const storage = new GridFsStorage({
  url: url,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          console.error('Error generating random bytes:', err);
          return reject(err);
        }

        console.log('req.body:', req.body); // Log completo de req.body

        if (!req.body.articulo || !req.body.descripcion || !req.body.user) {
          console.log('Campos faltantes en req.body:', req.body);
          return reject(new Error('Missing required fields in req.body'));
        }

        const fileInfo = {// Aquí usamos new ObjectId para asegurar que sea un ObjectId
          filename: customId(req),
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

app.post('/users/check-filename',  upload.none(), async (req, res) => {
  let filename = customId(req)
  console.log('El id es este ', filename)

  if (!filename) {
    return res.status(400).json({ type: 'error', message: 'Filename is required' });
  }

  try {
    const filesCollection = mongoose.connection.db.collection('uploads.files');
    const existingFile = await filesCollection.findOne({ filename: filename });

    if (existingFile) {
      return res.status(400).json({ type: 'error', message: 'Ya subiste este mobiliario, inténtalo de nuevo.' });
    }

    res.json({ type: 'success', message: 'Filename is unique' });
  } catch (error) {
    console.error('Error while checking filename:', error);
    res.status(500).json({ type: 'error', message: 'Error in the server', details: error });
  }
});

app.post('/users/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    console.log('No file uploaded');
    res.json({ type: 'failed', message: 'Ingrese una imagen para poder continuar.' });
    return res.status(400).json({ type: 'error', message: 'No file uploaded' });
  }
  console.log('req.body in /users/upload:', req.body); // Log req.body
  addFurnit(req, (err, result) => {
    if (err) {
      return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
    }
    res.json(result);
  });
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

// app.get('/users/files/:id', async (req, res) => {
//   if (!gfsBucket) {
//     console.log('gfsBucket no está inicializado');
//     return res.status(500).json({ err: 'GridFSBucket no está inicializado' });
//   }

//   console.log('Obteniendo archivo...');

//   try {
//     const file = await gfsBucket.find({ _id: req.params.id }).toArray();

//     if (!file || file.length === 0) {
//       console.log('No se encontró el archivo');
//       return res.status(404).json({ err: 'No se encontró el archivo' });
//     }

//     console.log('Archivo encontrado...', file);
//     res.json(file);

//   } catch (err) {
//     console.error('Error al obtener el archivo: ', err);
//     res.status(500).json({ err: 'Error al obtener archivos' });
//   }
// });

// Get one file
app.get('/users/files/:filename', async (req, res) => {
  if (!gfsBucket) {
    console.log('gfsBucket no está inicializado');
    return res.status(500).json({ err: 'GridFSBucket no está inicializado' });
  }

  try {
    const file = await gfsBucket.find({ filename: req.params.filename }).toArray();

    if (!file || file.length === 0) {
      console.log('No se encontró el archivo');
      return res.status(404).json({ err: 'No se encontró el archivo' });
    }

    res.json(file[0]);
  } catch (err) {
    console.error('Error al obtener el archivo:', err);
    res.status(500).json({ err: 'Error al obtener el archivo' });
  }
});


// Display Images
app.get('/users/image/:id', async (req, res) => {
  if (!gfsBucket) {
    console.log('gfsBucket no está inicializado');
    return res.status(500).json({ err: 'GridFSBucket no está inicializado' });
  }

  console.log('Obteniendo archivo de GridFS...', req.params.id);

  try {
    const fileImageCursor = await gfsBucket.find({ _id: req.params.id }).toArray();

    if (!fileImageCursor || fileImageCursor.length === 0) {
      console.log('No se encontró el archivo');
      return res.status(404).json({ err: 'No se encontró el archivo' });
    }

    const fileImage = fileImageCursor[0];

    if (fileImage.contentType === 'image/jpeg' || fileImage.contentType === 'image/png' || fileImage.contentType === 'image/jpg') {
      console.log('Es una imagen, devolviendo el stream');
      const readstream = gfsBucket.openDownloadStream(fileImage._id);
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
