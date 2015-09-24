app.controller('searchController', ['$scope', 'searchFactory', function($scope, searchFactory) {
  $scope.searchResults = [];
  
  
  $scope.search = function () {
    searchFactory.getSearchResults($scope.test);
  };


        

}]);
