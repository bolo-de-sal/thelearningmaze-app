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

    LobbyController.$inject = ['$scope', '$routeParams', '$q', '$interval', 'AuthenticationService', 'SessionService', '$location', '$rootScope', 'EventService', 'AlertService', 'AppConfig'];
    function LobbyController($scope, $routeParams, $q, $interval, AuthenticationService, SessionService, $location, $rootScope, EventService, AlertService, AppConfig) {
    	var lobbyCtrl = this;

        lobbyCtrl.joinedGroups = [];

        var eventId = $routeParams.eventId;

        $rootScope.selectedEvent = $routeParams.eventId;

        $rootScope.dataLoading = true;

        EventService.getEventById(eventId).then(function(response){
            lobbyCtrl.event = response;
        }, function(error){
            AlertService.Add('danger', error.data.message, true);
        });

        $interval(function(){
            $q.all([
                EventService.getEventGroups(eventId)
            ]).then(function(response){
                lobbyCtrl.groups = response[0];
            },function(error){
                $rootScope.dataLoading = false;
                AlertService.Add('danger', error.data.message);
            })
            .finally(function(){
                if(lobbyCtrl.event.codStatus != 'A'){
                    $location.path('/control-panel/' + eventId);
                }

                angular.forEach(lobbyCtrl.joinedGroups, function(memberId, key){
                    setOnlineMember(lobbyCtrl.groups, memberId);
                });

                $rootScope.dataLoading = false;
            });
        }, AppConfig.app.lobby.time.groups.refresh);

        // $interval(function(){
        //     EventService.getEventGroups(eventId).then(function(response){
        //         angular.forEach(lobbyCtrl.groups, function(groupItem, key){
        //             angular.forEach(response, function(responseGroupItem, key){
        //                 if(groupItem.Grupo.codGrupo == responseGroupItem.Grupo.codGrupo){
        //                     groupItem.Grupo.finalizado = responseGroupItem.Grupo.finalizado;
        //                 }
        //             });
        //         });
        //     });
        // }, 10000);

        lobbyCtrl.initEvent = function(eventId){
        	$rootScope.dataLoading = true;

        	EventService.initEvent(eventId).then(function(response){
        		$.connection.hub.start().done(function (message) {
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
                angular.forEach(group.ParticipantesGrupo, function(member, key){
                    if(member.codParticipante == memberId){
                        member.online = true;
                    }
                });
            });
        }

        $rootScope.evento.client.joinEvento = function (memberGroup) {
            if($.inArray(memberGroup.Participante.codParticipante, lobbyCtrl.joinedGroups) == -1){
                lobbyCtrl.joinedGroups.push(memberGroup.Participante.codParticipante);
            }
        }

        $.connection.hub.stop();

        $.connection.hub.start().done(function () {
            console.log("Professor entrou no grupo do evento: " + eventId);
            $rootScope.evento.server.joinEventoProfessor(eventId);
        })
        .fail(function (reason) {
            console.log("SignalR connection failed: " + reason);
        });
    }