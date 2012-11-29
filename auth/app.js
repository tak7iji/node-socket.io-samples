var express = require('express');
var app = express()
, http = require("http")
, server = http.createServer(app) 
, connect = require("express/node_modules/connect")
, io = require('socket.io').listen(server);

var sessionStore = new express.session.MemoryStore();

server.listen(3000);

app.configure(function(){
   app.use(express.static(__dirname));
   app.set('secretKey', 'mySecret');
   app.set('cookieSessionKey', 'sid');
   app.use(express.bodyParser());
   app.use(express.cookieParser(app.get('secretKey')));
   app.use(express.session({
       key : app.get('cookieSessionKey'),
       store : sessionStore
   }));
});

app.get('/', function(req, res) {
   res.redirect('/timer');
});

app.get('/timer', function(req, res) {
   res.sendfile(__dirname + '/timer.html');
});

io.configure(function() {
  io.set('authorization', function(handshakeData, callback) {
    var cookie = require('cookie').parse(decodeURIComponent(handshakeData.headers.cookie));
    console.log(handshakeData.headers.cookie);
    console.log(decodeURIComponent(handshakeData.headers.cookie));
    console.log(cookie);
    cookie = connect.utils.parseSignedCookies(cookie, app.get('secretKey'));
    var sessionID = cookie[app.get('cookieSessionKey')];
    console.log(cookie);
    console.log(sessionID);
    callback(null, true);
  });
});

io.on('connection', function (socket) {
   console.log('connected');

   var time=0;
   setInterval(function() {
     time++;
     if (time % 5 == 0){
       socket.emit('message', '接続してから' + time + '秒経過');
     }
   }, 1000);

   socket.on('disconnect', function() {
     console.log('disconnected');
   });
});
