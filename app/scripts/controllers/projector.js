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

    }