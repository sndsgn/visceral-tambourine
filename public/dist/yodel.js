angular.module('app', ['app.controllers', 'app.services','ui.router'])
  .config(function ($stateProvider, $locationProvider) {
    $stateProvider
      .state('landing', {
        templateUrl: 'landing.html',
        url: '/',
        controller: 'LandingController'
      })
      .state('create', {
        url: '/create',
        templateUrl: 'create.html',
        controller: 'CreateController'
      })
      .state('event', {
        url: '/events/:event',
        templateUrl: 'event.html',
        controller: 'EventController'
      })
      .state('event.playlist', {
        templateUrl: 'event.playlist.html',
        controller: 'EventController'
      })
      .state('event.search', {
        url: '/search',
        templateUrl: 'event.search.html',
        controller: 'SearchController'
      });

      $locationProvider.html5Mode({
        enabled: true
      });
  });



;angular.module('app.controllers', [])
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

      // this variable will let us hide the player from event insiders other than
      // the creator
      $scope.isCreator = socket.id() === Event.creator;

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
        console.log("ready");
        if ($scope.songs[$scope.songIndex] && socket.id() === Event.creator) {
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
          console.log('$scope.songs 001', $scope.songs);
        if ($scope.songs[$scope.songIndex] && event.data === YT.PlayerState.ENDED && socket.id() === Event.creator) {
          console.log("loadNext");
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

      socket.on('songAdded', function (song) {
        console.log(song);
      });
    }
  ]);
;angular.module('app.services', [])
  .factory('socket', function ($rootScope) {
    //initializes a socket connection on the client
    var socket = io.connect();
    return {
      //this is the angular implementation of the socket io methods on and emit
      //stolen from the internet
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      },
      //a getter for the id of the socket
      id: function () {
        return socket.id;
      },
    };
  })
  .factory('searchFactory', ['$http', '$window', 'socket',
    function ($http, $window, socket) {
      var key = '';
      $http.get('/config')
        .then(function(res) {
          key = res.data;
        }, function(res) {
          console.error();
        });

      return {
        //The searchFactory getSearch results method handles the get request using the searchTerms provided
        //by the user in the page.
        getSearchResults: function (searchTerm) {
          var editedSearchTerm = searchTerm.split(' ').join('+');

          return $http.get('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + editedSearchTerm + '&maxResults=10&key=' + key)
            .then(function (res) {
              return res.data;
            }, function (res) {
              console.log('Request Error');
            });
        },

        //The addSong factory method aids the addSong controller method in adding songs to the playlist.
        addSong: function (song) {
          socket.emit('addSong', song);
        },

        //The addSong factory method aids the addSong controller method in redirecting the user to the playlsit
        //after adding a song to the playlist.
        showPlaylist: function () {}

      };
    }
  ])
  .factory('Event', function () {
    //globally stored event name for routing purposes.
    return {
      event: '',
      creator: ''
    };
  });

