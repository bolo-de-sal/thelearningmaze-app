'use strict';

/**
 * @ngdoc function
 * @name thelearningmaze.controller:LoginController
 * @description
 * # LoginController
 * Controller of the thelearningmaze
 */
angular.module('thelearningmaze')
    .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', '$rootScope', 'AuthenticationService', 'SessionService', 'GlobalMessageService'];

    function LoginController($location, $rootScope, AuthenticationService, SessionService, GlobalMessageService) {
        var loginCtrl = this;

        loginCtrl.login = login;

        function login() {
            $rootScope.dataLoading = true;
            AuthenticationService.Login(loginCtrl.username, loginCtrl.password, function (response) {
                var user = response._professor; //verificar futuramente em caso de login do aluno
                var newToken = response.newToken;
                var tokenInfo = SessionService.getTokenInfo();
                tokenInfo.newToken = newToken;

                SessionService.setUser(user);
                SessionService.setTokenInfo(tokenInfo);

                $location.path('/home');
            });
        };
    }
