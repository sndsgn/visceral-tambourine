"use strict";


describe('ajaxController', function () {
  var $scope, $rootScope, searchFactory, $httpBackend;

  // using angular mocks, we can inject the injector
  // to retrieve our dependencies
  beforeEach(module('app'));
  beforeEach(inject(function ($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    searchFactory = $injector.get('searchFactory');
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    var createController = function () {
      return $controller('SearchController', {
        $scope: $scope,
        searchFactory: searchFactory 
      });
    };
  }));

  it('should have a searchResults property on the $scope', function () {
    createController();
    expect($scope.searchResults).to.be.an('array');
  });

  it('should have a search method on the $scope', function () {
    createController();
    expect($scope.search).to.be.a('function');
  });
  it('should get search results when search() is called', function () {
    var mockresults = [{"user": "yodelMan"},{"track": "live to yodel"},{"plays": 100000}];
    $httpBackend.expectGET("/api/search").respond(mockresults);
    createController();
    $httpBackend.flush();
    expect($scope.searchResults).to.eql(mockresults);
  });
});
