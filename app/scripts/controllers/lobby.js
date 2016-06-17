'use strict';

/**
 * @ngdoc function
 * @name thelearningmaze.controller:LobbyController
 * @description
 * # LobbyController
 * Controller of the thelearningmaze
 */
angular
    .module('thelearningmaze')
    .controller('LobbyController', LobbyController);

    LobbyController.$inject = ['$routeParams', 'AuthenticationService', 'SessionService', '$location', '$rootScope', "EventService"];
    function LobbyController($routeParams, AuthenticationService, SessionService, $location, $rootScope, EventService) {
    	var lobbyCtrl = this;

        var eventId = $routeParams.eventId;
        $rootScope.selectedEvent = $routeParams.eventId;

        $rootScope.dataLoading = true;

        EventService.getEventGroups(eventId).then(getEventGroupsSuccess, getEventGroupsFailure);

        function getEventGroupsSuccess(response){
        	console.log("Grupos do evento: " + eventId);
            console.log(response);

            lobbyCtrl.groups = response;
            $rootScope.dataLoading = false;
        }

        function getEventGroupsFailure(response){
            $rootScope.dataLoading = false;
        }

        lobbyCtrl.initEvent = function(eventId){
        	$rootScope.dataLoading = true;

        	EventService.initEvent(eventId).then(function(response){
        		console.log("Response iniciar evento: ", response);

        		$rootScope.dataLoading = false;

        		$location.path('control-panel/' + eventId);
        	});
        }

        // $rootScope.evento.client.joinEvento = function (message) {
        //     console.log("Chamou joinEvento", message);
        //     alert('Alguém entrou no lobby. Mensagem SignalR: ');
        // }

  //       evento.on("client.joinEvento", function(message){
		// 	console.log("Chamou joinEvento", message);
  //           alert('Alguém entrou no lobby. Mensagem SignalR: ');
		// });

        // Abre conexão com o servidor
        $.connection.hub.start().done(function (message) {
            console.log("Conexão com o SignalR aberta com sucesso!");
            $rootScope.evento.server.joinEventoProfessor("10");
        }).fail(function (reason) {
            console.log("SignalR connection failed: " + reason);
        });

        //  $.connection.hub.start().done(function(){
        //  	console.log("Entrou no done lobby");
        //  });


		// evento.client.on("joinEvento", function(message){
		// 	console.log("Chamou joinEvento", message);
  //           alert('Alguém entrou no lobby. Mensagem SignalR: ');
		// });
        
    }