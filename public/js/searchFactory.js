app.factory('searchFactory', ['$http', '$window', function($http, $window) {
  console.log('factory');

  return {
    getSearchResults: function(searchTerm) {

      $window.SC.initialize({
        client_id: 'd41103ac2809edc015e95b6ebfdf8164'
      });  

      $window.SC.get('/tracks', {q: searchTerm}, function(tracks) {
        console.log(tracks);
      });
    }


  };
}]);




