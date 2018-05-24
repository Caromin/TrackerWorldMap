const appConfig = require('./config.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const firebase = require('firebase');
const logger = require('morgan');
const path = require('path');

const index = require('./routes/index');
const users = require('./routes/users');

const app = express();

const config = {
  apiKey: appConfig.firebasekey.secret,
  authDomain: "repfamdatabase.firebaseapp.com",
  databaseURL: "https://repfamdatabase.firebaseio.com",
  storageBucket: "repfamdatabase.appspot.com",
};
firebase.initializeApp(config);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
