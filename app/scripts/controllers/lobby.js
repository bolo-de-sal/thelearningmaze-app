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

        // Habilita CORS
        jQuery.support.cors = true;

        // Declara endereço do servidor
        $.connection.hub.url = "http://tlm-api-dev.azurewebsites.net/signalr";

        // chatHub é o nome do Hub definido no código do server
        var evento = $.connection.eventoHub;
        
        $.connection.hub.logging = true;

        evento.client.joinEvento = function (message) {
            //$('#discussion').append('<li>' + message + ' entrou no evento!</li>');
            alert('Alguém entrou no lobby. Mensagem SignalR: ' + message);
        }

    }