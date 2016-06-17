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
  .config(function ($routeProvider) {
    $routeProvider
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
  .run(function ($rootScope, $location, AppConfig, RestrictedPagesConfig, AuthenticationService, SessionService, AlertService, EventService) {

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

      /*========Configs signalR=========*/

      // Habilita CORS
      jQuery.support.cors = true;

      // // Declara endereço do servidor
      $.connection.hub.url = "http://tlm-api-dev.azurewebsites.net/signalr";

      // // chatHub é o nome do Hub definido no código do server
      $rootScope.evento = $.connection.eventoHub;

      $.connection.hub.logging = true;

      /*========End Configs signalR=========*/

      $rootScope.$on('$locationChangeStart', function (event, next, current) {
          AlertService.Clear();

          if($rootScope.sessionTimeout){
            AlertService.Add('warning', 'Sua sessão expirou', true);
            $rootScope.sessionTimeout = false;
          }

          $rootScope.loginPage = $location.path() == '/login';
          $rootScope.projectorPage = $location.path().split("/")[1] == 'projector';

          // redirect to login page if not logged in and trying to access a restricted page
          var restrictedPage = $.inArray($location.path(), RestrictedPagesConfig.anonymousAccess) === -1;
          if (restrictedPage && !$rootScope.userLoggedIn) {
            $location.path('/login');
          }else if(!restrictedPage){
            if($rootScope.userLoggedIn){
              $location.path('/');
            }else if($location.search().codGrupo && $location.search().codParticipante){
              $.connection.hub.start().done(function (response) {
                  $rootScope.evento.server.joinEvento(25, 2);
                  console.log("SignalR connection success", response);
              }).fail(function (reason) {
                  console.log("SignalR connection failed: " + reason);
              });

              if($location.path() != '/student'){
                $location.url('/student?codGrupo=' + $location.search().codGrupo + '&codParticipante=' + $location.search().codParticipante);
              }
            }
          }else if($rootScope.userLoggedIn){
            switch($location.path()){
              case '/login':
              case '/student':
                $location.path('/');
                break;

              default:
                EventService.getActiveEvent().then(function(response){
                  var codEvento = response.codEvento;

                  $.connection.hub.start().done(function () {
                      // evento.server.joinEventoProfessor(homeCtrl.activeEvent.identificador);
                      $rootScope.evento.server.joinEventoProfessor("10");
                  })
                  .fail(function (reason) {
                      console.log("SignalR connection failed: " + reason);
                  });
                }, function(response){
                  //Error
                });

                // $.connection.hub.start().done(function (response) {
                //     $rootScope.evento.server.joinEvento(25, 2);
                //     console.log("SignalR connection success", response);
                // }).fail(function (reason) {
                //     console.log("SignalR connection failed: " + reason);
                // });


            }
          }

          // $location.path('/');

      });

      // Global
      $rootScope.userLoggedIn = SessionService.getUser();
      $rootScope.Logout = AuthenticationService.Logout;
      $rootScope.CloseAlert = AlertService.CloseAlert;
      $rootScope.imagesUrl = AppConfig.api.endpoint + AppConfig.api.identifier + '/Imagens';

      $rootScope.evento.client.joinEvento = function (message) {
            console.log("Chamou joinEvento", message);
            alert('Alguém entrou no lobby. Mensagem SignalR: ');
        }
  });
