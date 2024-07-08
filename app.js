var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const { MongoClient, GridFSBucket } = require('mongodb');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const layout = require('express-ejs-layouts')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layout)

const url = 'mongodb://localhost:27017/'
const dbName = 'Clarac'

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
let db;
let bucket;

client.connect().then(() => {
  console.log('Connected to MongoDB');
  db = client.db(dbName);
  bucket = new GridFSBucket(db, {
    bucketName: 'images'
  });

  app.get('/images/:id', (req, res) => {
    const id = req.params.id;
    const downloadStream = bucket.openDownloadStream(ObjectId(id));

    downloadStream.on('data', (chunk) => {
      res.write(chunk);
    });

    downloadStream.on('end', () => {
      res.end();
    });

    downloadStream.on('error', (err) => {
      console.error('Error downloading image from GridFS', err);
      res.status(404).send('Image not found');
    });
  });
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
