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

//eventList { start: 
//     { socketId: {},
//            uSsdY5kotd89cH7cAAAD: { socketId: 'creator', songs: [], insiderCount: 1 } } }


//var eventState = {};
//var eventList = [];
var eventList = {};
var insiderToEventMap = {};
var socketObject;


io.on('connection', function (socket) {
  socketObject = socket;
  //triggered when the join button on landing.html is clicked
  socket.on('join', function (event) {
    //server side socket will join the event passed in
//    eventList.forEach(function(item) { 
    if(eventList[event]) {
      socket.join(event);
      eventList[event][socket.id] = 'insider-' + eventlist[event];
      eventlist[event].insidersCount++;
      socket.emit('success', true);
      return;
    } else if(!eventList[event]) {
      eventList[event] = {};
      eventList[event][socket.id] = 'creator';
      eventList[event].insidersCount = 1;
      socket.emit('success', true);
      return;
        //        insiderToEventMap[socket.id] = event;
    } else {
      socket.emit('success', false);
    }
  });

      socket.on('disconnect', function(user) {
//        if(socket.conn.id === eventList
        
        console.log('FROM SERVER', user, 'socket', socket.conn.id, 'socket.handshake.headers.referer', socket.handshake.headers.referer);
//        socket.broadcast.to(roomname).emit('Demz gone! from controller', {user_name: 'controller'});
      });
  //triggered when someone enters the event
  socket.on('joined', function () {
    //send the state of the event to the client
//    socket.emit('joined', eventState[insiderToEventMap[socket.id]]);
    for(var prop in eventList) {
      if(eventList[prop][socket.id]) {
        socket.emit('joined', eventList[prop].songs);
      }
    }

  });

  //triggered when the create button is clicked on create.html
  socket.on('create', function (event) {
    //server side socket joins the event that is passed in
    if (!eventList[event]) {
      socket.join(event);
      //push the event to the events list
      eventList[event] = {};
//      eventList[event][socketId] = 'creator';
      //create a prop on eventState object with name of the event. Init w/ empty array
    // eventState[event] = [];
      
      eventList[event].songs = [];
      //map socket id to event
    //  insiderToEventMap[socket.id] = event;
      if(eventList[event][socket.id] !== 'creator') {
        eventList[event][socket.id] = 'creator';
        eventList[event].insiderCount = 1;
      }
      socket.emit('createable', true);
      return;
    }

    socket.emit('createable', false);
  });
  //triggered when someone clicks add in search.html
  socket.on('addSong', function (song) {
    //add the song to the event state for the event of the socket
  //  eventState[insiderToEventMap[socket.id]].push(song);
     for(var prop in eventList) {
       console.log('prop', prop, 'eventList', eventList, 'socket.id', socket.id);
       if(eventList[prop][socket.id]) {
         eventList[prop].songs.push(song);
         console.log('prop[socket.id]', prop[socket.id]);
         console.log('eventList', eventList);
       }
     }

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
   var eventExists = false;
    for(var item in eventList) {
      if (item === event) {
        eventExists = true;
      } 
    }

    if(eventExists) {
      socketObject.join(event);
      res.redirect('../#/events/' + event);
    } else {
      console.log('event doesnt exist reroute');
      res.redirect('..');
    }
  } else {
    path = '/public/' +  path;
    res.sendFile(__dirname + path);
  }
});



var port = process.env.PORT || 3030;
server.listen(port, function() {
  console.log('Listening on ' + port);
});
