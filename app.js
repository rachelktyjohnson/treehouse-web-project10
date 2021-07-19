var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var booksRouter = require('./routes/books');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRouter);

//import database and models
let sequelize = require('./models').sequelize;


(async () => {
  try{
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  }catch (error) {
    if(error.name === 'SequelizeValidationError') {
      //pull all the errors into an array
      const errors = error.errors.map(err => err.message);
      console.error('Validation errors: ', errors);
    } else {
      throw error;
    }
  }
})();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  //next(createError(404));
  const error = new Error();
  error.status = 404;
  error.message = "Oops! Page not found.";
  res.render('page_not_found', {error})
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  err.status = err.status || 500;
  err.message = err.message || "Sorry! There was an unexpected error on the server.";
  console.log(err.status);
  console.log(err.message);
  res.render('error', {error:err});
});

module.exports = app;
