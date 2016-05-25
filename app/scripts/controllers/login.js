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

    LoginController.$inject = ['$location', '$rootScope', 'AuthenticationService', 'SessionService', 'AlertService'];

    function LoginController($location, $rootScope, AuthenticationService, SessionService, AlertService){
        var loginCtrl = this;

        loginCtrl.login = login;

        $("body").addClass("bodyLogin");

        function login() {
            
            // Exibe o loader
            $rootScope.dataLoading = true;

            AuthenticationService.Login(loginCtrl.username, loginCtrl.password).then(loginSuccess, loginError);

            function loginSuccess(response){
                // Verificar futuramente em caso de login do aluno
                var user = response._professor;
                var userToken = response.newToken;
                var tokenInfo = SessionService.getTokenInfo();

                tokenInfo.userToken = userToken;

                SessionService.setUser(user);
                SessionService.setTokenInfo(tokenInfo);

                $location.path('/');

                $rootScope.dataLoading = false;
            }

            function loginError(error){
                $rootScope.dataLoading = false;

                AlertService.Add('danger', 'Usuários ou senha inválidos');
            }
        };
    }
