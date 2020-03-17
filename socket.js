var app=require('express')();
var http=require('http').Server(app);
var io=require('socket.io')(http);
var port=88;

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});


io.on('connection',function(socket){
  socket.on('addworkd',function(data){
    console.log(data);
    socket.broadcast.emit('csserver',data);
  })
})


http.listen(port,function(){
  console.log('listening on *:'+port);
})