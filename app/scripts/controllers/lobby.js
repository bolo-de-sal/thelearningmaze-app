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

    LobbyController.$inject = ['$location', '$rootScope', 'GlobalMessageService'];
    function LobbyController($location, $rootScope, GlobalMessageService) {

        console.log("--->LobbyController init");
    }