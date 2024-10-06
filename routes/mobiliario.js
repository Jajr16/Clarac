// routes/mobiliario.js
const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const furnitures = require('../bin/Mobiliario');
const addFurnit = require('../bin/AddMobiliario');
const modFurnit = require('../bin/MobiliarioModify');
const delFurnit = require('../bin/deleteMobiliario');
const upload = require('../config/multerConfig'); 
const isAuthenticated = require('../middleware/authMiddleware')

const customId = require('../utils/customId');

const url = 'mongodb://localhost:27017/Clarac';
let gfsBucket = null;

try {
  const conn = mongoose.createConnection(url);
  mongoose.connect(url);
  
  conn.once('open', () => {
    gfsBucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });
    console.log('Conexión a MongoDB establecida y GridFSBucket inicializado.');
  });

  conn.on('error', (err) => {
    console.error('Error de conexión a MongoDB:', err);
  });
  
} catch (error) {
  console.error('Error conectando a MongoDB:', error);
}

// Rutas de mobiliario
router.post('/', isAuthenticated, (req, res) => {
  furnitures(req, (err, result) => {
    if (err) {
      return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
    }
    res.json(result);
  });
});

router.post('/new_mob', isAuthenticated, (req, res) => {
  addFurnit(req, (err, result) => {
    if (err) {
      return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
    }
    res.json(result);
  });
});

router.post('/mod_mob', isAuthenticated, upload.none(), (req, res) => {
  modFurnit(req, (err, result) => {
    if (err) {
      return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
    }
    res.json(result);
  });
});

router.post('/delMob', isAuthenticated, upload.none(), async (req, res) => {
  delFurnit(req, async (err, result) => {
    if (err) {
      return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
    }

    let filename = customId(req, false)

    if (!filename) {
      return res.status(400).json({ type: 'error', message: 'Nombre del archivo requerido.' });
    }

    const filesCollection = mongoose.connection.db.collection('uploads.files');
    const existingFile = await filesCollection.findOne({ filename: filename });

    if (existingFile) {
      await gfsBucket.delete(existingFile._id)
    }

    res.json(result);
  });
})

router.post('/renameImage', isAuthenticated, upload.single('file'), async (req, res) => {
  try {
    let filename = customId(req, false)
    console.log('El filename original es este ', filename)

    if (!filename) {
      return res.status(400).json({ type: 'error', message: 'Nombre del archivo requerido.' });
    }

    const filesCollection = mongoose.connection.db.collection('uploads.files');
    const originalDocument = await filesCollection.findOne({ filename: filename });

    if (originalDocument) {

      let Newfilename = customId(req, true);
      console.log('El filename nuevo es este', Newfilename);

      await filesCollection.updateOne(
        { _id: originalDocument._id }, // Filtro para seleccionar el documento original
        { $set: { filename: Newfilename } } // Actualización para cambiar el nombre del archivo
      );

      res.json({ type: 'success', message: 'Nombre del archivo actualizado con éxito.' });
    } else {
      res.status(404).json({ type: 'error', message: 'Documento no encontrado.' });
    }

  } catch (err) {
    console.error('Error al modificar la imagen:', err);
    res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
  }
})

router.post('/renew', isAuthenticated, upload.single('file'), async (req, res) => {
  try {

    if (!req.file) {
      return res.json({ type: 'No image' })
    } else {

      let filename = customId(req, false)
      console.log('El filename es este ', filename)

      if (!filename) {
        return res.status(400).json({ type: 'error', message: 'Nombre del archivo requerido.' });
      }

      const filesCollection = mongoose.connection.db.collection('uploads.files');
      const existingFile = await filesCollection.findOne({ filename: filename });

      if (existingFile) {
        await gfsBucket.delete(existingFile._id)
      }

      const customFilename = customId(req, true);
      const file = {
        filename: customFilename,
        bucketName: 'uploads',
      };

      res.json({ type: 'success', message: 'Imagen actualizada con éxito.' })
    }


  } catch (err) {
    console.error('Error al modificar el mobiliario:', err);
    res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
  }
})

router.post('/users/check-filename', isAuthenticated, upload.none(), async (req, res) => {
  let filename = customId(req, false)
  console.log('El id es este ', filename)

  if (!filename) {
    return res.status(400).json({ type: 'error', message: 'Nombre del archivo requerido.' });
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

router.post('/users/upload', isAuthenticated, upload.single('file'), (req, res) => {
  if (!req.file) {
    console.log('No file uploaded');
    res.json({ type: 'failed', message: 'Ingrese una imagen para poder continuar.' });
    return res.status(400).json({ type: 'error', message: 'No file uploaded' });
  }

  addFurnit(req, (err, result) => {
    if (err) {
      return res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
    }
    res.json(result);
  });
});

router.get('/users/files', isAuthenticated, async (req, res) => {
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

router.post('/users/disp_image', isAuthenticated, upload.none(), async (req, res) => {
  let filename = customId(req, false)
  console.log('Pues el filename que encontró es', filename)

  if (!gfsBucket) {
    console.log('gfsBucket no está inicializado');
    return res.status(500).json({ err: 'GridFSBucket no está inicializado' });
  }

  try {
    const file = await gfsBucket.find({ filename: filename }).toArray();

    if (!file || file.length === 0) {
      console.log('No se encontró el archivo');
      return res.status(404).json({ err: 'No se encontró el archivo' });
    }

    const fileImage = file[0]

    if (fileImage.contentType === 'image/jpeg' || fileImage.contentType === 'image/png' || fileImage.contentType === 'image/jpg') {
      console.log('Es una imagen, devolviendo el stream');
      const readstream = gfsBucket.openDownloadStream(fileImage._id);
      readstream.pipe(res);
    } else {
      console.log('El archivo no es una imagen');
      res.status(404).json({ err: 'No es una imagen' });
    }

  } catch (err) {
    console.error('Error al obtener el archivo:', err);
    res.status(500).json({ err: 'Error al obtener el archivo' });
  }
});

router.get('/users/image/:id', isAuthenticated, async (req, res) => {
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

module.exports = router;