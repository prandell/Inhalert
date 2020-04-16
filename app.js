if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(logger('dev'));
// app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash())
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware - Makes sure session info encrypted (User credentials)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session())

// Express Messages Middleware
app.use(flash()) //////////////////// <------------?????
// app.use(function (req, res, next) {
//   res.locals.messages = require('express-messages')(req, res);
//   next();
// });

//DATABASE
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true},
    function(err){
      if(!err){
        console.log('Connected to mongo.');
      }else{
        console.log('Failed to connect to mongo!', err);
      }
});
mongoose.connection.once('open', () => {
  console.log("MongoDB database connection established successfully")
});


//Route Files
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });



module.exports = app;
