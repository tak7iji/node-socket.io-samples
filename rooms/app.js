
/**
 * Module dependencies.
 */

var express = require('express')
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

app.get('/',  function(req, res, next){
  res.render('room1', { title: 'Chat Room1' });
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);

io.on('connection', function(socket) {
  socket.on('join', function(room) {
    socket.join(room);
    socket.set('room', room);
    console.log('join to '+room);
  });

  socket.on('client send', function(msg) {
    socket.get('room', function(err, room) {
      console.log('broadcasting to '+room);
      if(room != null) {
        socket.broadcast.to(room).emit('server send', '#(to) '+msg)
        console.log(io.sockets.in(room));
        io.sockets.in(room).emit('server send', '#(in) '+msg)
      }
      socket.emit('server send', msg)
      console.log(io.sockets.in(room));
    });
  });

  socket.on('leave', function() {
    socket.get('room', function(err, room) {
      socket.leave(room);

      console.log('leave from '+room);
      delete socket.store.data['room'];
      delete io.sockets.clients[socket.id];
      io.sockets.in(room).emit('server send', 'leave client ['+socket.id+'] from room ['+room+']' )
    });
  });
});
