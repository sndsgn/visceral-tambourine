var http    = require('http'),
    express = require('express'),
    app     = express(),
    server  = http.Server(app),
    config  = require('./config'),
    html    = require('html'),
    io      = require('socket.io')(server);

//app.get('/', function (req, res) {
//  res.sendStatus(200);
//});

app.get('/config', function (req, res) {
  res.send(config.key);
});


var eventState = {};
var eventList = [];
var insiderToEventMap = {};
var socketObject;


io.on('connection', function (socket) {
  socketObject = socket;
  //triggered when the join button on landing.html is clicked
  socket.on('join', function (event) {
    //server side socket will join the event passed in
    eventList.forEach(function(item) {
      if (item === event) {
        socket.join(event);
        insiderToEventMap[socket.id] = event;
        socket.emit('success', true);
        return;
      }
    });
    socket.emit('success', false);
  });

  //triggered when someone enters the event
  socket.on('joined', function () {
    //send the state of the event to the client
    socket.emit('joined', eventState[insiderToEventMap[socket.id]]);
  });

  //triggered when the create button is clicked on create.html
  socket.on('create', function (event) {
    //server side socket joins the event that is passed in
    if (eventList.indexOf(event) === -1) {
      socket.join(event);
      //push the event to the events list
      eventList.push(event);
      //create a prop on eventState object with name of the event. Init w/ empty array
      eventState[event] = [];
      //map socket id to event
      insiderToEventMap[socket.id] = event;
      socket.emit('createable', true);
      return;
    }

    socket.emit('createable', false);
  });
  //triggered when someone clicks add in search.html
  socket.on('addSong', function (song) {
    console.log('Server on("addSong"', song);
    //add the song to the event state for the event of the socket
    eventState[insiderToEventMap[socket.id]].push(song);
    //broadcast to all insiders the added song
    io.to(insiderToEventMap[socket.id]).emit('songAdded', song);
  });
});

//app.use(express.static(__dirname + '/public'));
app.get(['/', '/:*', '/dist/*', '/images/*', '/bower_components/*', '*.html', '/events/*'], function(req, res, next) {
  var path = req.url;
  if(path === '/') {
    path = '/public/';
    res.sendFile(__dirname + path);
  } else if(path.slice(0,8) === '/events/' && path.length > 8 && path.slice(8,9) !== ':') {
   var event = path.slice(8);
   console.log('event', event, 'path', path);
    eventList.forEach(function(item) {
      if (item === event) {
        socketObject.join(event);
        res.redirect('../#/events/' + event);
      } else {
        res.redirect('..');
      }
    });
  } else {
    path = '/public/' +  path;
    res.sendFile(__dirname + path);
  }
});



var port = process.env.PORT || 3030;
server.listen(port, function() {
  console.log('Listening on ' + port);
});
