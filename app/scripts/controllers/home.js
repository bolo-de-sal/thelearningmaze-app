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

        function logout(){
            AuthenticationService.Logout();
        }
    }