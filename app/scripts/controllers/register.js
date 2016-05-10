'use strict';

/**
 * @ngdoc function
 * @name thelearningmaze.controller:RegisterController
 * @description
 * # RegisterController
 * Controller of the thelearningmaze
 */
angular
    .module('thelearningmaze')
    .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['UserService', '$location', '$rootScope', 'GlobalMessageService'];
    function RegisterController(UserService, $location, $rootScope, GlobalMessageService) {
        var registerCtrl = this;

        registerCtrl.register = register;

        function register() {
            registerCtrl.dataLoading = true;
            UserService.Create(registerCtrl.user)
                .then(function (response) {
                    if (response.success) {
                        GlobalMessageService.Success('Registration successful', true);
                        $location.path('/login');
                    } else {
                        GlobalMessageService.Error(response.message);
                        registerCtrl.dataLoading = false;
                    }
                });
        }
    }