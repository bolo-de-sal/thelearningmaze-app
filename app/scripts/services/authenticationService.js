'use strict';

angular
    .module('thelearningmaze')
    .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout', 'AppConfig', 'GlobalMessageService'];

    function AuthenticationService($http, $cookieStore, $rootScope, $timeout, AppConfig, GlobalMessageService) {
        var authentication = {};

        authentication.Login = Login;

        return authentication;

        function Login(username, password, callback) {
            
            $http.post(AppConfig.api.identifier + '/professors/login', { email: username, senhaText: password })
               .success(function (response) {
                   callback(response);
               });

        }

        function logout(){
          // $http.delete(AppConfig.api.identifier + '/professors/login', { email: username, senhaText: password })
          //      .success(function (response) {
          //          callback(response);
          //      });
          return true;
        }
    }