'use strict';

/**
 * @ngdoc function
 * @name thelearningmaze.controller:ProjectorController
 * @description
 * # ProjectorController
 * Controller of the thelearningmaze
 */
angular
    .module('thelearningmaze')
    .controller('ProjectorController', ProjectorController);

    ProjectorController.$inject = [/*'AuthenticationService', 'SessionService',*/ '$location', '$rootScope', "EventService"];
    function ProjectorController(/*AuthenticationService, SessionService,*/ $location, $rootScope, EventService) {

    	var projectorCtrl = this;

        console.log("--->ProjectorController init");

        $("body").removeClass("bodyLogin");
        $(".header").hide();
        $("body").css("overflow-y", "hidden");
        $(".content").css("top", "0px");

        var event = {
            q1: 1,
            q2: 2,
            q3: 3,
            q4: 4
        }

        var codEvento = 1;

        EventService.getEventGroups(codEvento).then(getEventGroupsSuccess, getEventGroupsFailure);

        function getEventGroupsSuccess(response){
            console.log("Grupos do evento: " + codEvento);
            console.log(response);

            angular.forEach(response, function(group, key){
                group.Grupo.codAssunto = (key % 4) + 1;
            });

            projectorCtrl.groups = response;
            $rootScope.dataLoading = false;
        }

        function getEventGroupsFailure(response){
            console.log("Grupos do evento: " + codEvento);
            console.log(response);
            $rootScope.dataLoading = false;
        }

    }