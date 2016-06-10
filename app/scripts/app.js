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
    'ui.bootstrap'
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
      .when('/aluno', {
        templateUrl: 'views/aluno.html',
        controller: 'AlunoController',
        controllerAs: 'aluno'
      })
      .otherwise({
        redirectTo: '/404'
    });
  })
  .run(function ($rootScope, $location, AuthenticationService, SessionService, AlertService) {

      $(".navbar-nav:first li").each(function(){
          $(this).click(function(){
              $(this).siblings().removeClass("active");
              $(this).addClass("active");
          });
      });

      $rootScope.$on('$locationChangeStart', function (event, next, current) {
          AlertService.Clear();

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

      // Global
      $rootScope.user = SessionService.getUser();
      $rootScope.Logout = AuthenticationService.Logout;
      $rootScope.CloseAlert = AlertService.CloseAlert;
  });
