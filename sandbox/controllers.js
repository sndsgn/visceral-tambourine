angular.module('app.controllers', [])
  .controller('LandingController', ['$scope', '$location', 'socket', 'Event',
    function ($scope, $location, socket, Event) {
      $scope.join = function (event) {
        socket.emit('join', event);
        Event.event = event;
        $location.path('/events/' + event);
      };
  }])
  .controller('EventController', ['$scope', '$location', 'socket', 'Event',
    function ($scope, $location, socket, Event) {

      $scope.songs = Event.songs;

      $scope.search = function () {
        $location.path('/search');
      };
      socket.on('joined', function (songs) {
        Event.songs = songs;
        $scope.songs = Event.songs;
      });
      socket.on('songAdded', function (song) {
        console.log(socket.id());
        Event.songs.push(song);
        $scope.songs = Event.songs;
      });
    }
  ])
  .controller('SearchController', ['$scope', '$location', 'socket', 'searchFactory', 'Event',
    function ($scope, $location, socket, searchFactory, Event) {

      $scope.searchResults = [];

      $scope.home = function () {
        $location.path('/events/' + Event.event);
      };

      $scope.addSong = function (song) {
        searchFactory.addSong(song);
      };

      $scope.getSearchResults = function (searchTerm) {
        searchFactory.getSearchResults(searchTerm)
          .then(function(result) {
            result.items.forEach(function (song) {
              var songObj = {
                id: song.id.videoId,
                url: 'https://www.youtube.com/embed/' + song.id.videoId,
                title: song.snippet.title,
                thumbnail: song.snippet.thumbnails.medium.url
              };
              $scope.searchResults.push(songObj);
            });
          });
      };
      socket.on('songAdded', function (song) {
        console.log(song);
      });
    }
  ]);