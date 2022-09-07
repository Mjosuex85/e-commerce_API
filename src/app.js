const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport')
const session = require('express-session');

require('./db.js');

const server = express();

const routes = require('./routes/index.js');

server.name = 'API';

const { URL_ALLOWED, KEY_SECRET, LOCALHOST1,  LOCALHOST2, LOCALHOST3, LOCALHOST4, LOCALHOST5, LOCALHOST6, LOCALHOST7 } = process.env;

server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser(KEY_SECRET));
server.use(morgan('dev'));
server.use((req, res, next) => {
  const whiteList = [
    `http://${LOCALHOST1}`,
    `http://${LOCALHOST2}`,
    `http://${LOCALHOST3}`,
    `http://${LOCALHOST4}`,
    `http://${LOCALHOST5}`,
    `http://${LOCALHOST6}`,
    `http://${LOCALHOST7}`,
    'https://e-commerce-videogames.vercel.app/',
  ]
  if (whiteList.indexOf(req.headers.origin) !== -1) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});
server.use(session({
  secret: KEY_SECRET,
  resave: false,
  saveUninitialized: false,
}));
server.use(passport.initialize());
server.use(passport.session());
server.use(passport.authenticate(KEY_SECRET));
server.use('/', routes);

// Error catching endware.// 
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
