//"use strict";

// mocha tests: 
describe('searchController', function () {
  var scope;
  var location;
  var socket;
  var Event;
  var searchFactory;
  var ctrl;

  beforeEach(module('app.controllers'));
  beforeEach(module('app.services'));

  
  beforeEach(inject(function($rootScope, $location,  $controller, _searchFactory_, _socket_, _Event_) {
    scope = $rootScope.$new();
    ctrl = $controller('SearchController', {$scope: scope});
    searchFactory = _searchFactory_;
    socket = _socket_;
    Event = _Event_;
    location = $location;
  }));

  describe('getSearchResults', function () {
    beforeEach(function () {
      var searchResults = {items:[{id: {videoId:'example id'}, snippet: {title: 'example title', thumbnails: {medium: {url: 'thumbnailUrl'}}}}]};
      scope.$apply(function () {
        scope.searchTerm = 'test search text';
      });
      sinon.stub(searchFactory, 'getSearchResults', function() {
        return {
          then: function (cb) {
            cb(searchResults);
          }
        };
      });
    });

    it('should return search results when getSearchResults() is called', function () {
      scope.getSearchResults();
      expect(scope.searchResults[0].id).to.equal('example id');
    });
  });

});

describe('LandingController', function () {
  var scope, location, socket, event, ctrl;
  
  beforeEach(module('app.controllers'));
  beforeEach(module('app.services'));
  
  beforeEach(inject(function($rootScope, $controller, $location, _socket_, _Event_) {
    scope = $rootScope.$new();
    ctrl = $controller('LandingController', {$scope: scope});
    location = $location;
    socket = _socket_;
    Event = _Event_;
  }));

  describe('join function', function () {
    beforeEach(function () {
      sinon.stub(socket, 'emit', function() {});
    });

    it('should add an event on join', function () {
      scope.join('Liquid Swords');
      expect(Event.event).to.equal('Liquid Swords');
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
