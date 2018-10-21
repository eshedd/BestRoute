if (!process.env.PORT) {
  require('dotenv').config();
}
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tripsRouter = require('./routes/trips');
var participantsRouter = require('./routes/participants');



const webpush = require('web-push');

const publicVapidKey = 'BLJb8402GEwEq24TleVWQ432pqz6WqPp16Axz5gh_J4emMOy51OVXZLpJs_1KgRaA66P3G7iXd4AiDUqmn8rge0';
const privateVapidKey = 'hJX9oUue7nxaUckyxv6WXwGmH7kEkVCDShme2WFBggs';

// Replace with your email
webpush.setVapidDetails('mailto:patrick.bohan.wang@gmail.com', publicVapidKey, privateVapidKey);



var app = express();
require('dotenv').config();

const session = require('express-session');
app.use(session({ secret: 'secret-unique-code', cookie: { maxAge: 3600000 }, resave: true, saveUninitialized: true }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/trips', tripsRouter);
app.use('/participants', participantsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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


app.use(require('body-parser').json());

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  res.status(201).json({});
  const payload = JSON.stringify({ title: 'test' });

  console.log(subscription);

  webpush.sendNotification(subscription, payload).catch(error => {
    console.error(error.stack);
  });
});

app.use(require('express-static')('./'));

const mongoose = require('mongoose');
const mongoURI = 'mongodb://user1:password1@ds223763.mlab.com:23763/bestroute';

mongoose.connect(mongoURI)
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = app;
