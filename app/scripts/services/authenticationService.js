'use strict';

angular
    .module('thelearningmaze')
    .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$rootScope', '$timeout', '$location', 'AppConfig', 'SessionService', 'GlobalMessageService'];

    function AuthenticationService($http, $rootScope, $timeout, $location, AppConfig, SessionService, GlobalMessageService) {
        var authentication = {};

        authentication.Login = Login;
        authentication.Logout = Logout;

        return authentication;

        function Login(username, password, callback) {
            
            $http.post(AppConfig.api.identifier + '/professors/login', { email: username, senhaText: password })
            .success(function (response) {
              callback(response);
            });

        }

        function Logout(){
          // $http.delete(AppConfig.api.identifier + '/professors/login')
          //      .success(function (response) {
          //          callback(response);
          //      });

          SessionService.removeUserData();

          $location.path('/login');
        }
    }