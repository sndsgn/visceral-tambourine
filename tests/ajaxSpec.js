//"use strict";

// mocha tests: 
describe('searchController', function () {
  var scope;
  var searchFactory;
  var ctrl;

  beforeEach(module('app'));

  beforeEach(inject(function($rootScope, $controller, _searchFactory_) {
    scope = $rootScope.$new();
    ctrl = $controller('searchController', {$scope: scope});
    searchFactory = _searchFactory_;
  }));

  describe('search function', function () {
    beforeEach(function () {
      var searchResults = {items:[{id: {videoId:'example id'}, snippet: {title: 'example title', thumbnails: {medium: {url: 'thumbnailUrl'}}}}]};
      scope.$apply(function () {
        scope.test = 'test search text';
      });
      sinon.stub(searchFactory, 'getSearchResults', function() {
        return {
          then: function (cb) {
            cb(searchResults);
          }
        };
      });
    });

    it('should return search results when search() is called', function () {
      scope.search();
      expect(scope.searchResults[0].id).to.equal('example id');
    });
  });

});

describe('searchFactory', function () {
  beforeEach(module('app'));

  var searchFactory;
  var $window;
  var $httpBackend;

  beforeEach(inject(function(_searchFactory_, _$window_, _$httpBackend_) {
    searchFactory = _searchFactory_;
    $window = _$window_;
    $httpBackend = _$httpBackend_;
  }));

  // it('should call the youtube api', function () {
  //   $httpBackend.expect('GET', 'url').respond('['fake': 'example']);

  //   $httpBackend.flush();

  //   //assertion goes here;
  // });


});
