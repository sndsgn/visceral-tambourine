//searchController contains all of the client logic for handling different input from any user type.
app.controller('searchController', ['$scope', 'searchFactory', function($scope, searchFactory) {
  $scope.searchResults = [];

//The the $scope's search method uses a factory method called getSearchResults to take the user search input
//and query the YouTube API.
//The searchTerm from the user has its spaces changed to '+' signs in the getSearchResults factory method.
//The promise chained to the getSearchResults factory method in the controller takes the response
//from the YouTube API which is an array of objects and creates separate objects only with the 
//properties required. Those new objects are then pushed to the $scope.searchResults array, so that 
//the Angular logic in the ng-repeat can populate the search results.
  $scope.search = function () {
    $scope.searchResults = [];
    searchFactory.getSearchResults($scope.searchTerm).then(function(res) {
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

//The addSong method on the $scope passes the song object that is connected to the
//click event attached to the "Add song to playlist" button which use the ng-click directive to call addSong.
//This method will pass the song object the searchFactory method addSong to populate the playlist
//in client view that presents the playlist.
  $scope.addSong = function(song) {
    console.log(song);
    searchFactory.addSong(song);
  };

}]);
