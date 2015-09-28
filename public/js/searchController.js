app.controller('searchController', ['$scope', 'searchFactory', function($scope, searchFactory) {
  $scope.searchResults = [];
  
  
  $scope.search = function () {
    $scope.searchResults = searchFactory.getSearchResults($scope.test);
  };


        

}]);
