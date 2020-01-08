var app = require('express')();//定义app模块
var session=require('express-session');
var boydparser=require('body-parser');
var http = require('http').Server(app);  //定义http 服务器 并用app开启
var io = require('socket.io')(http);  //定义io 使用http 服务
var port = process.env.PORT || 3000;//定义端口
var onlineUsers=0;
app.use(session({
  secret:'oker',
  cookie:{maxAge:80*1000},
  resave:true,
  saveUninitialized:false
}));


app.use(boydparser.urlencoded({
  extended:false
}))

app.set('view engine','ejs')

app.get('/', function(req, res){
  res.render('login');
});//启动任务首次加载选择的路径
app.post('/login',function (req,res) {
  let qq=req.body.qq;
  req.session.oker=qq;
  res.render('index',{
    qq:req.session.oker,
  })
})
io.on('connection', function(socket){
  onlineUsers++;
  io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });

  socket.on('chat message', function(msg){ //接受socket  chat message方法的数据
    io.emit('chat message',msg);//  推送给所有客户端 chat message
  });

  socket.on('disconnect',function () {
    onlineUsers--;
    io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });
  })
});
//on  是接受    emit 是提交  第一个参数对应  后跟function 或者数据

http.listen(port, function(){//开启端口   并在控制台输出
  console.log('listening on *:' + port);
});
