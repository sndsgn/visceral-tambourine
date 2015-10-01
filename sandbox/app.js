angular.module('app', ['app.controllers', 'app.services','ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'landing.html',
        controller: 'LandingController'
      })
      .when('/events/:event', {
        templateUrl: 'event.html',
        controller: 'EventController'
      })
      .when('/search', {
        templateUrl: 'search.html',
        controller: 'SearchController'
      });
  });

