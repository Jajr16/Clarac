const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { GridFSBucket } = require('mongodb');

const MONGO_URL = 'mongodb://127.0.0.1:27017/Clarac';
const OUTPUT_DIR = path.join(__dirname, '../uploads/mobiliario');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

mongoose.connect(MONGO_URL);

mongoose.connection.once('open', async () => {
    console.log('Mongo conectado');

    const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads'
    });

    const files = await mongoose.connection.db
        .collection('uploads.files')
        .find()
        .toArray();

    console.log(`Encontrados ${files.length} archivos`);

    for (const file of files) {
        const outputPath = path.join(OUTPUT_DIR, `${file.filename}.jpg`);

        console.log('Exportando:', file.filename);

        const stream = bucket.openDownloadStream(file._id);
        stream.pipe(fs.createWriteStream(outputPath));
    }

    console.log('Exportación completa');
});
