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

    HomeController.$inject = ['AuthenticationService', 'SessionService', '$rootScope', '$location'];

    function HomeController(AuthenticationService, SessionService, $rootScope, $location) {
        var homeCtrl = this;

        homeCtrl.user = SessionService.getUser();
        homeCtrl.logout = logout;

        $("body").removeClass("bodyLogin");
        $(".header").show();

        function logout(){

            $("body").addClass("bodyLogin");
            $(".header").hide();
            AuthenticationService.Logout();
        }
    }
