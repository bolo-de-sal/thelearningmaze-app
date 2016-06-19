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

    LobbyController.$inject = ['$routeParams', '$q', 'AuthenticationService', 'SessionService', '$location', '$rootScope', 'EventService', 'AlertService'];
    function LobbyController($routeParams, $q, AuthenticationService, SessionService, $location, $rootScope, EventService, AlertService) {
    	var lobbyCtrl = this;

        lobbyCtrl.joinedGroups = [];

        var eventId = $routeParams.eventId;

        $rootScope.selectedEvent = $routeParams.eventId;

        $rootScope.dataLoading = true;         

        $q.all([
            EventService.getEventById(eventId),
            EventService.getEventGroups(eventId)
        ]).then(function(response){
            lobbyCtrl.event = response[0];
            lobbyCtrl.groups = response[1];
        },function(error){
            AlertService.Add('danger', error.data.message);
        })
        .finally(function(){
            $rootScope.dataLoading = false;
        });

        lobbyCtrl.initEvent = function(eventId){
        	$rootScope.dataLoading = true;

        	EventService.initEvent(eventId).then(function(response){
        		console.log("Response iniciar evento: ", response);

        		$.connection.hub.start().done(function (message) {
		            console.log("Disparou iniciarJogo con id: ", eventId);
		            $rootScope.evento.server.iniciarJogo(eventId);
                    $location.path('control-panel/' + eventId);
		        }).fail(function (reason) {
		            console.log("SignalR connection failed: " + reason);
		        });
            }).finally(function(){
        		$rootScope.dataLoading = false;
            });
        }

        $rootScope.evento.client.joinEvento = function (group) {
            lobbyCtrl.joinedGroups.push(group);
            console.log(lobbyCtrl.joinedGroups);
        }
    }