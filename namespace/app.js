
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//app.get('/', routes.index);
//app.get('/users', user.list);
//app.get('/room1', function(req, res, next) {
//console.log('connect to room1');
//next();
//});
app.get('/room1', routes.room1);
app.get('/room2', routes.room2);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);

//io.settings.log = false;
var room1 = io.of('/room1').on('connection', function(socket) {
  io.sockets.emit('server send', 'Room1: Connect from '+socket.handshake.address.address);

  var broadcaster = function(event) {
    room1.emit('server send', '>>> '+event.message);
    console.log(event.message);
  };

  socket.on('client send', broadcaster);

  socket.on('disconnect', function(event) {
    console.log('disconnected.');
//    console.log(io.sockets);
  });
});

var room2 = io.of('/room2').on('connection', function(socket) {
  var nickname;
  io.sockets.emit('server send', 'Room2: Connect from '+socket.handshake.address.address);
  socket.on('send nickname', function(name) {
    socket.set('nickname', name, function() {
      nickname = name;
    });
  });
  socket.on('client send', function(event) {
    socket.emit('server send', event.message);
    socket.broadcast.emit('server send', nickname+'>>> '+event.message);
    console.log(event.message);
  });
});
