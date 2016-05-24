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

        function Login(username, password) {
            
            var promise = $http.post(AppConfig.api.identifier + '/professors/login', { email: username, senhaText: password })
            .then(function(response){
              return response.data;
            });

            return promise;

        }

        function Logout(){
          // $http.delete(AppConfig.api.identifier + '/professors/login')
          //      .success(function (response) {
          //          callback(response);
          //      });
          SessionService.removeUserData();

          $("body").addClass("bodyLogin");
          $(".header").hide();

          $location.path('/login');
        }
    }