'use strict';

/**
 * @ngdoc overview
 * @name thelearningmaze
 * @description
 * # thelearningmaze
 *
 * Main module of the application.
 */

angular
  .module('thelearningmaze', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngStorage'
  ])
  .config(function ($routeProvider) {
    $routeProvider
    //   .when('/', {
    //     templateUrl: 'views/main.html',
    //     controller: 'MainCtrl',
    //     controllerAs: 'main'
    //   })
    //   .when('/home', {
      .when('/', {
          templateUrl: 'views/home.html',
          controller: 'HomeController',
          controllerAs: 'home'
      })
      .when('/login', {
          templateUrl: 'views/login.html',
          controller: 'LoginController',
          controllerAs: 'login'
      })
      .when('/register', {
          templateUrl: 'views/register.html',
          controller: 'RegisterController',
          controllerAs: 'register'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/404'
      });
  })
  .run(function ($rootScope, $location, $cookieStore, $http, SessionService) {

      $rootScope.$on('$locationChangeStart', function (event, next, current) {

          // redirect to login page if not logged in and trying to access a restricted page
          var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;

          var loggedIn = SessionService.getUser();

          if (restrictedPage && !loggedIn) {
            $location.path('/login');
            $(".header").hide();
            $("body").addClass("bodyLogin");
          }else if(loggedIn && $location.path() === '/login'){
            $location.path('/');
            $(".header").show();
            $("body").removeClass("bodyLogin");
          }

      });
  });
