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
    'timer',
    'base64'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
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
      .when('/control-panel/:eventId', {
        templateUrl: 'views/control-panel.html',
        controller: 'ControlPanelController',
        controllerAs: 'controlPanel'
      })
      .when('/lobby/:eventId', {
        templateUrl: 'views/lobby.html',
        controller: 'LobbyController',
        controllerAs: 'lobby'
      })
      .when('/projector/:eventId', {
        templateUrl: 'views/projector.html',
        controller: 'ProjectorController',
        controllerAs: 'projector'
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
  .run(function ($rootScope, $location, $routeParams, AppConfig, RestrictedPagesConfig, AuthenticationService, SessionService, AlertService, EventService) {

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

      var QueryString = function () {
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
          var pair = vars[i].split("=");
              // If first entry with this name
          if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
              // If second entry with this name
          } else if (typeof query_string[pair[0]] === "string") {
            var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
            query_string[pair[0]] = arr;
              // If third or later entry with this name
          } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
          }
        }
        return query_string;
      }();

      /*========Configs signalR=========*/

      // jQuery.support.cors = true;
      $.connection.hub.url = AppConfig.signalr.endpoint;
      $rootScope.evento = $.connection.eventoHub;
      $.connection.hub.logging = true;

      $.connection.hub.connectionSlow(function () {
          alert('Detectamos que sua conexão com a internet está lenta');
      });

      $.connection.hub.error(function (error) {
          console.log('Ops! Ocorreu um erro: ' + error)
      });

      // $rootScope.evento.client.joinEvento = function(){
      //   console.log('join evento cliente chamado');
      // }

      // $rootScope.evento.client.lancarPergunta = function(){
      //   console.log('lancar pergunta chamado');
      // }

      /*========End Configs signalR=========*/

      $rootScope.$on('$locationChangeStart', function (event, next, current) {
          AlertService.Clear();

          if($rootScope.userLoggedIn && !SessionService.getTokenInfo().userToken){
            $rootScope.userLoggedIn = null;
            SessionService.removeUserData();
            $location.path('/login');
          }

          if($rootScope.sessionTimeout){
            AlertService.Add('warning', 'Sua sessão expirou', true);
            $rootScope.sessionTimeout = false;
          }

          $rootScope.loginPage = $location.path() == '/login';
          $rootScope.projectorPage = $location.path().split("/")[1] == 'projector';

          var codGrupo = $location.search().codGrupo || QueryString.codGrupo;
          var codParticipante = $location.search().codParticipante ||QueryString.codParticipante;
          console.log(window.location.href);
          // redirect to login page if not logged in and trying to access a restricted page
          var restrictedPage = $.inArray($location.path(), RestrictedPagesConfig.anonymousAccess) === -1;
          if (restrictedPage && !$rootScope.userLoggedIn) {
            $location.path('/login');
          }else if(!restrictedPage){
            if($rootScope.userLoggedIn){
              $location.path('/');
            }else if(codGrupo && codParticipante){
              if($location.path() != '/student'){
                window.location = window.location.href.split('?')[0] + '#/student?codGrupo=' + codGrupo + '&codParticipante=' + codParticipante;
                // $location.url('#/student?codGrupo=' + codGrupo + '&codParticipante=' + codParticipante);
              }
            }
          }else if($rootScope.userLoggedIn){
            switch($location.path()){
              case '/login':
              case '/student':
                $location.path('/');
                break;
            }
          }
      });

      // Global
      $rootScope.userLoggedIn = SessionService.getUser();
      $rootScope.Logout = AuthenticationService.Logout;
      $rootScope.CloseAlert = AlertService.CloseAlert;
      $rootScope.imagesUrl = AppConfig.api.endpoint + AppConfig.api.identifier + '/Imagens';
  });
