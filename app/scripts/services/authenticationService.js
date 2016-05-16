'use strict';

angular
    .module('thelearningmaze')
    .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$location', 'AppConfig', 'SessionService'];

    function AuthenticationService($http, $location, AppConfig, SessionService) {
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
          console.log("aqui");

          SessionService.removeUserData();

          $("body").addClass("bodyLogin");
          $(".header").hide();

          $location.path('/login');
        }
    }