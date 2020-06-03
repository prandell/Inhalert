/**
 * Environment variables
 */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

/**
 * Modules
 */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());

/**
 * Request body parser (req.body)
 */
app.use(express.urlencoded({ extended: false }));

/**
 * Passport initialisation
 */
const passport = require('passport');
const initialisePassport = require('./config/passport')
initialisePassport(passport)

/**
 * View engine set up
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


/**
 * Session middleware - encrypts information stored in sessions
 */
const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

/**
 * Passport middleware
 */
app.use(passport.initialize())
app.use(passport.session())

/**
 * Flash messaging middleware
 */
const flash = require('connect-flash');
app.use(flash())

/**
 * CORS allowing
 */
app.use(cors());

/**
 * Messaging configuration
 */
app.use(function (req, res, next) {
    // res.locals.messages = require('express-messages')(req, res); /// look into this
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


/**
 * All routes
 */
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let dashRouter = require('./routes/dashboard');
let sitesRouter = require('./routes/sites');
let emailsRouter = require('./routes/emails');
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dashboard', dashRouter);
app.use('/emails', emailsRouter);
app.use('/sites', sitesRouter);


/**
 * Catch 404 and forward to error handler
 */
app.use(function(req, res, next) {
  next(createError(404));
});


/**
 * Error handler
 */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
