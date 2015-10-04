angular.module('app.controllers', [])
.controller('LandingController', ['$scope', '$location', 'socket', 'Event',
    function ($scope, $location, socket, Event) {
      //function called when join button clicked
      $scope.join = function (event) {
        //send the event to the server
        socket.emit('join', event);
        //set the name of the event. Used for routing purposes
        Event.event = event;

        //move the insider into the event
        $location.path('/events/' + event);
      };
      //directs user to the create event page
      $scope.create = function () {
        $location.path('/create');
      };
    }])
.controller('CreateController', ['$scope', '$location', 'socket', 'Event',
    function ($scope, $location, socket, Event) {
      //function called when the create button is pushed
      $scope.create = function (event) {
        //set the name of the event.
        Event.event = event;
        console.log(socket.id());
        Event.creator = socket.id();
        console.log(Event.creator);
        //send the event to the server so it can do creation things
        socket.emit('create', event);
        //redirect  to the event
        $location.path('/events/' + event);
      };
    }])
.controller('EventController', ['$window', '$scope', '$state', 'socket', 'Event',
    function ($window, $scope, $state, socket, Event) {
      //this is the array that gets ng-repeated in the view
      $scope.songs = [];

      // to keep track of which song is up
      $scope.songIndex = 0;

      //link to the search view
      $scope.search = function () {
        $state.go('event.search');
      };


      //let the server know that insider has arrived in the room.
      socket.emit('joined');

      //server responses to this with the eventState
      socket.on('joined', function (songs) {
        //add the songs from the server to the local array
        //making sure thats its empty before doing so
        if ($scope.songs.length === 0) {

          $scope.songs = songs;
        }

      });

      //server get the song from the insider that added the song and
      //boadcasts it to everyone in the event. Here we get the song and
      //add it to our local array
      socket.on('songAdded', function (song) {
        $scope.songs.push(song);
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
          if ($scope.songs[$scope.songIndex] && event.data === YT.PlayerState.ENDED && socket.id() === Event.creator) {
            console.log("loadNext");
            player.loadVideoById($scope.songs[$scope.songIndex].id);
            $scope.songIndex++;
          }
          console.log("loadnext");
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

        //********Original function name $scope.search. Make sure used consistently in partials and js files.*********
        searchFactory.getSearchResults(searchTerm)
          //******Originally $scope.searchTerm was passed as an argument to the factory method******
          //and there was nothing passed to the parent function. Make sure this is used consistently
          //and is not causing bugs.
          .then(function(result) {
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


