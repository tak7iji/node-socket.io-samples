// for express3
var express = require('express');
var app = express()
, http = require("http")
, server = http.createServer(app) 
, io = require('socket.io').listen(server);

// 8000ポートでプログラムを動作させる
server.listen(8000);

// 出力先の取得
app.configure(function(){
   app.use(express.static(__dirname));
});

app.get('/', function(req, res) {
   res.render('check', {}); //HTMLファイル名
});
//////////////////

// クライアントから接続があった時の処理 //
io.on('connection', function (socket) {
   console.log('connected');

   var time=0;
   setInterval(function() {
     time++;
     if (time % 5 == 0){
       io.sockets.emit('message', '接続してから' + time + '秒経過');
     }
   }, 1000);

   socket.on('disconnect', function() {
     console.log('disconnected');
   });
});
