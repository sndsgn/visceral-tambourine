app.controller('searchController', ['$scope', 'searchFactory', function($scope, searchFactory) {
  $scope.searchResults = [];
  

  $scope.search = function () {
    $scope.searchResults = [];
    searchFactory.getSearchResults($scope.searchTerm).then(function(res) {
     // console.log(res);
      for(var song = 0; song < res.items.length; song++) {
        var songObj = {
          id: res.items[song].id.videoId,
          url: 'https://www.youtube.com/embed/' + res.items[song].id.videoId,
          title: res.items[song].snippet.title,
          thumbnail: res.items[song].snippet.thumbnails.medium.url
        };
        $scope.searchResults.push(songObj);
      }
    });
  };

  $scope.addSong = function(song) {
    console.log(song);
    searchFactory.addSong(song);
  };

}]);
