app.factory('searchFactory', ['$http', '$window', function($http, $window) {
  var key = 'AIzaSyC_7kwz1nFe3CW8DxIcA9j8dI1oOQjOzFM';

  return {
    getSearchResults: function(searchTerm) {
      var editedSearchTerm = searchTerm.split(' ').join('+');

      return $http.get('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + editedSearchTerm + '&maxResults=10&key=' + key)
      .then(function(res) {
        return res.data;
      }, function(res) {
        console.log('Request Error');
      });
    },

    addSong: function(id) {
    },

    showPlaylist: function() {
    }

  };
}]);

   
//
//      console.log(artist, song);
//      $window.SC.initialize({
//        client_id: 'd41103ac2809edc015e95b6ebfdf8164'
//      });  
//
//      $window.SC.get('/users', {id: 3785024}, function(users) {
//        console.log(users);
//
//      });
//    }
//




