'use strict';

/**
 * @ngdoc function
 * @name thelearningmaze.controller:HomeController
 * @description
 * # HomeController
 * Controller of the thelearningmaze
 */
angular
    .module('thelearningmaze')
    .controller('HomeController', HomeController);

    HomeController.$inject = ['AuthenticationService', 'SessionService', 'eventService', '$rootScope', '$location'];

    function HomeController(AuthenticationService, SessionService, eventService, $rootScope, $location) {
        var homeCtrl = this;

        homeCtrl.user = SessionService.getUser();
        $rootScope.user = SessionService.getUser();
        homeCtrl.logout = logout;
        $rootScope.logout = logout;

        console.log("objProfessor: ", $rootScope.user);

        $("body").removeClass("bodyLogin");
        $(".header").show();

        eventService.getEvents(function(response){
            console.log("Response getEvents: ", response);
            homeCtrl.events = response;
        });

        function logout(){

            AuthenticationService.Logout();
            $("body").addClass("bodyLogin");
            $(".header").hide();
        }
    }
