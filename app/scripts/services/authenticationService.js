'use strict';

angular
    .module('thelearningmaze')
    .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$rootScope', '$http', '$location', 'AppConfig', 'SessionService'];

    function AuthenticationService($rootScope, $http, $location, AppConfig, SessionService) {
        var authentication = {};

        authentication.Login = Login;
        authentication.Logout = Logout;

        return authentication;

        function Login(username, password) {
            
          var promise = $http.post(AppConfig.api.identifier + '/professors/login', { email: username, senhaText: password })
          .then(function(response){
            return response.data;
          });

          return promise;

        }

        function Logout(){
          $rootScope.userLoggedIn = null;
          SessionService.removeUserData();

          $("body").addClass("bodyLogin");

          $location.path('/login');
        }
    }