// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const ws = require('ws');
// Initial and Config Server.
const app = express();
const server = http.Server(app);
const WebSocketServer = ws.Server

const staticDBUrl = 'mongodb://heroku_5hw5hpkv:ed2df3l29hifcjr1vkchi89att@ds239128.mlab.com:39128/heroku_5hw5hpkv';

// Mongoose setup
mongoose.Promise = global.Promise;
if (process.env.DB_CONNECTION || staticDBUrl) {
  mongoose.connect(process.env.DB_CONNECTION || staticDBUrl);
  const db = mongoose.connection;
  db.on('error', function(err){
    console.error(err);
  });
  db.once('open', function callback () {
    console.info('Connected to the database');
  });
  app.use(session({
    secret: 'ozkarta',
    store: new MongoStore({
      mongooseConnection: db,
      ttl: 3600 * 24 * 60, // 2 months
      touchAfter: 3600 * 24 * 2
    }),
    unset: 'destroy',
    cookie: { maxAge: (3600000 * 24 * 60) }, // 2 months
    resave: false,
    saveUninitialized: true
  }));
}

// Parsers for POST data
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/doc', express.static(path.join(__dirname, 'doc')));


// Get our API routes
const routes = require('./api/v1/shared/routes')(express);
const webSocketHandler = require('./websocket/chat-server').chatServerHandler;

// Set our api routes
app.use('/api/v1', routes);
// Test /ping
app.get('/ping', function(req, res){
  res.status(200).json({
    success: true
  });
});
// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
/*** Get port from environment and store in Express.*/
const port = process.env.PORT || 3000;
app.set('port', port);

server.listen(port, () => console.log(`Our server is running on: ${port}`));

let wss =new WebSocketServer({ server: server });
wss.on('connection', webSocketHandler);