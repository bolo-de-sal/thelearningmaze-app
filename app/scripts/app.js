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
    'ngStorage',
    'ui.bootstrap',
    'timer'
  ])
  .config(function ($routeProvider) {
    $routeProvider
    //   .when('/', {
    //     templateUrl: 'views/main.html',
    //     controller: 'MainCtrl',
    //     controllerAs: 'main'
    //   })
    //   .when('/home', {
      .when('/index', {
          templateUrl: 'index.html',
          controller: 'MainCtrl',
          controllerAs: 'main'
      })
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
      .when('/control-panel/:eventId', {
        templateUrl: 'views/control-panel.html',
        controller: 'ControlPanelController',
        controllerAs: 'controlPanel'
      })
      .when('/lobby', {
        templateUrl: 'views/lobby.html',
        controller: 'LobbyController',
        controllerAs: 'lobby'
      })
      .when('/student', {
        templateUrl: 'views/student.html',
        controller: 'StudentController',
        controllerAs: 'student'
      })
      .otherwise({
        redirectTo: '/404'
    });
  })
  .run(function ($rootScope, $location, AppConfig, RestrictedPagesConfig, AuthenticationService, SessionService, AlertService) {

      angular.element(document).ready(function () {
        lightbox.option({
          'albumLabel': '%1 de %2'
        });
      });

      $(".navbar-nav:first li").each(function(){
          $(this).click(function(){
              $(this).siblings().removeClass("active");
              $(this).addClass("active");
          });
      });

      $rootScope.$on('$locationChangeStart', function (event, next, current) {
          AlertService.Clear();

          $rootScope.loginPage = $location.path() == '/login';

          // redirect to login page if not logged in and trying to access a restricted page
          var restrictedPage = $.inArray($location.path(), RestrictedPagesConfig.anonymousAccess) === -1;

          if (restrictedPage && !$rootScope.userLoggedIn) {
            $location.path('/login');
          }else if($rootScope.userLoggedIn && $location.path() === '/login'){
            $location.path('/');
          }

      });

      // Global
      $rootScope.userLoggedIn = SessionService.getUser();
      $rootScope.Logout = AuthenticationService.Logout;
      $rootScope.CloseAlert = AlertService.CloseAlert;
      $rootScope.imagesUrl = AppConfig.api.endpoint + AppConfig.api.identifier + '/Imagens';
  });
