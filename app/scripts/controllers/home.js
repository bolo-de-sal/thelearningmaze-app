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

    HomeController.$inject = ['AuthenticationService', 'SessionService', 'EventService', '$rootScope', '$location'];

    function HomeController(AuthenticationService, SessionService, EventService, $rootScope, $location) {
        var homeCtrl = this;

        //homeCtrl.user = SessionService.getUser();
        $rootScope.user = SessionService.getUser();
        //homeCtrl.logout = logout;
        $rootScope.Logout = Logout;

        $("body").removeClass("bodyLogin");
        $(".header").show();

        EventService.getEvents(function(response){
            homeCtrl.events = response;
        });

        function Logout(){
            AuthenticationService.Logout();
            $("body").addClass("bodyLogin");
            $(".header").hide();
        }
    }
