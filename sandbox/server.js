var http    = require('http'),
    express = require('express'),
    app     = express(),
    server  = http.Server(app),
    io      = require('socket.io')(server);

app.use(express.static(__dirname));


app.get('/', function (req, res) {
  res.sendStatus(200);
});



var eventState = {};
var eventList = [];
var insiderToEventMap = {};

io.on('connection', function (socket) {

  socket.on('join', function (event) {
    socket.join(event);
    insiderToEventMap[socket.id] = event;
    io.to(event).emit('joined', eventState);
  });
  socket.on('create', function (event) {
    socket.join(event);
    eventList.push(event);
    eventState[event] = [];
    insiderToEventMap[socket.id] = event;
  });
  socket.on('addSong', function (song) {
    eventState.push(song);
    io.to(insiderToEventMap[socket.id]).emit('songAdded', song);
  });
});

server.listen(3030);