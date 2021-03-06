angular.module('app.controllers', [])
  .controller('LandingController', ['$scope', '$location', 'socket', 'Event',
    function ($scope, $location, socket, Event) {
      //function called when join button clicked
      $scope.join = function (event) {
        //send the event to the server
        socket.emit('join', event);
      
        socket.on('success', function (success) {
          if (success) {
            Event.event = event;
            //move the insider into the event
            $location.path('/events/' + event);
          } else {
            $scope.error = true;
          }
        })
      };
      //directs user to the create event page
      $scope.create = function () {
        $location.path('/create');
      };
    }
  ])
  .controller('CreateController', ['$scope', '$location', 'socket', 'Event',
    function ($scope, $location, socket, Event) {
      //function called when the create button is pushed
      $scope.create = function (event) {
        //send the event to the server so it can do creation things
        socket.emit('create', event);
        socket.on('createable', function (createable) {
          if (createable) {
          //set the name of the event.
            Event.event = event;
            Event.creator = socket.id();
            window.sessionStorage.setItem('Event.creator', Event.creator);
            //redirect  to the event
            $location.path('/events/' + event);
          } else {
            $scope.error = true;
          }
        });
      };
    }
  ])
  .controller('EventController', ['$window', '$scope', '$state', '$location', 'socket', 'Event',
    function ($window, $scope, $state, $location, socket, Event) {
      //this is the array that gets ng-repeated in the view
      $scope.songs = [];
      socket.on('disconnect', function(user) {
        console.log('FROM CONTROLLER', user, 'socket', socket.conn.id);
//        socket.broadcast.to(roomname).emit('Demz gone! from controller', {user_name: 'controller'});
      });


      // this variable will let us hide the player from event insiders other than
      // the creator
      //$scope.isCreator = socket.id() === Event.creator;
      $scope.isCreator = window.sessionStorage.getItem('Event.creator') === Event.creator;

      // to keep track of which song is up
      $scope.songIndex = 0;

      //link to the search view
      $scope.search = function () {
        $state.go('event.search');
      };

      $scope.roomInvite = $state.href($state.current.name, $state.params, {
        absolute: true
      });
      $scope.shareEvent = function () {
        new Clipboard('.share');
      };

      if(!socket.id()) {
        var event = $location.url().slice(8);
        socket.emit('join', event);
      
        socket.on('success', function (success) {
         
          if (success) {
            Event.event = event;
            //move the insider into the event
            $location.path('/events/' + event);
          } else {
            $scope.error = true;
          }
        })
      }

      //let the server know that insider has arrived in the room.
      socket.emit('joined');

      //server responses to this with the eventState
      socket.on('joined', function (songs) {
        //add the songs from the server to the local array
        //making sure thats its empty before doing so
        if ($scope.songs.length === 0) {

          $scope.songs = songs || [];
        }

      });

      //server get the song from the insider that added the song and
      //boadcasts it to everyone in the event. Here we get the song and
      //add it to our local array
      socket.on('songAdded', function (song) {
       if($scope.songs.indexOf(song) === -1) {
          $scope.songs.push(song);
        } 
      });

      $state.go('event.playlist');

      // fired when the youtube iframe api is ready

      $window.onPlayerReady = function onPlayerReady(event) {
        if ($scope.songs[$scope.songIndex] && socket.id() === window.sessionStorage.getItem('Event.creator')) {
          player.cueVideoById($scope.songs[$scope.songIndex].id);
          $scope.songIndex++;
          event.target.playVideo();
        } else {
          player.destroy();
        }
      };

      // fired on any youtube state change, checks for a video ended event and
      // plays next song if yes
      $window.loadNext = function loadNext(event) {
        if ($scope.songs[$scope.songIndex] && event.data === YT.PlayerState.ENDED && socket.id() === Event.creator) {
          player.loadVideoById($scope.songs[$scope.songIndex].id);
//          $scope.songs.shift();
          $scope.songIndex++;
        }
      };

      // if the songs list used to be empty but now isn't, call the
      // onYouTubeIframAPIReady function (for loading reasons, has to be called
      // manually like this when you return from the search page)
      $scope.$watch(function (scope) {
          return scope.songs;
        },
        function (newVal, oldVal) {
          if (oldVal.length === 0 && newVal.length > 0) {
            $window.onYouTubeIframeAPIReady();
          }
        });

    }

  ])
  .controller('SearchController', ['$scope', '$state', 'socket', 'searchFactory', 'Event',
    //******SearchController capitalized here, but not in original file. Check that it is consistently used in *****
    //HTML partial using this controller.
    function ($scope, $state, socket, searchFactory, Event) {
      //array of results we get back from the you tubes
      $scope.searchResults = [];

      //link back to event
      $scope.home = function () {
        $state.go('event.playlist');
      };

      //function called when insider hits the add button
      //defers work to the factory, just passes along the song obj.
      $scope.addSong = function (song) {
        searchFactory.addSong(song);
      };

      //defers the http call to the factory, then adds the songs to the
      //local array
      $scope.getSearchResults = function (searchTerm) {
        $scope.searchResults = [];

        searchFactory.getSearchResults(searchTerm)
          .then(function (result) {
            result.items.forEach(function (song) {
              var songObj = {
                id: song.id.videoId,
                url: 'https://www.youtube.com/embed/' + song.id.videoId,
                title: song.snippet.title,
                thumbnail: song.snippet.thumbnails.medium.url
              };
              $scope.searchResults.push(songObj);
              $scope.searchTerm = '';
            });
          });
      };
    }
  ]);
