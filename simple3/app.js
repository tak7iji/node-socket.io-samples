var express = require('express');
var app = express()
, http = require("http")
, server = http.createServer(app)
, io = require('socket.io').listen(server);

io.set('log level', 4);

server.listen(3000);

app.configure(function(){
   app.use(express.static(__dirname));
});

app.get('/', function(req, res) {
   res.render('check', {}); //HTMLファイル名
});

io.on('connection', function (socket) {
   console.log('connected');
   socket.on('client send', function(data) {
     socket.emit('server send', data);
     socket.broadcast.emit('server send', '>>> '+data);
   });
});
