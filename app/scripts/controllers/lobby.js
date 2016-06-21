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

    LobbyController.$inject = ['$scope', '$routeParams', '$q', 'AuthenticationService', 'SessionService', '$location', '$rootScope', 'EventService', 'AlertService'];
    function LobbyController($scope, $routeParams, $q, AuthenticationService, SessionService, $location, $rootScope, EventService, AlertService) {
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
            if(lobbyCtrl.event.codStatus != 'A'){
                $location.path('/control-panel/' + eventId);
            }

            angular.forEach(lobbyCtrl.joinedGroups, function(memberId, key){
                console.log('Membro', memberId);
                setOnlineMember(lobbyCtrl.groups, memberId);
            });
            
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

        function setOnlineMember(groups, memberId){
            angular.forEach(groups, function(group, key){
                console.log('Grupo', group);
                angular.forEach(group.ParticipantesGrupo, function(member, key){
                    console.log('Membro', member);
                    if(member.codParticipante == memberId){
                        member.online = true;                        
                    }
                });
            });

            if(!$scope.$$phase) {
                $scope.$apply();
            }
        }

        $rootScope.evento.client.joinEvento = function (memberGroup) {
            if($.inArray(memberGroup.Participante.codParticipante, lobbyCtrl.joinedGroups)){
                lobbyCtrl.joinedGroups.push(memberGroup.Participante.codParticipante);
            }
            
            setOnlineMember(lobbyCtrl.groups, memberGroup.Participante.codParticipante);
            
            console.log(lobbyCtrl.joinedGroups);
        }

        $.connection.hub.start().done(function () {
            console.log("Professor entrou no grupo do evento: " + eventId);
            $rootScope.evento.server.joinEventoProfessor(eventId);
        })
        .fail(function (reason) {
            console.log("SignalR connection failed: " + reason);
        });  
    }