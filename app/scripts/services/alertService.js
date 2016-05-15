'use strict';

angular
    .module('thelearningmaze')
    .factory('AlertService', AlertService);

    AlertService.$inject = ['$rootScope'];

    function AlertService($rootScope) {
        var alertService = {};
        alertService.Add = Add;
        alertService.CloseAlert = CloseAlert;
        alertService.Clear = Clear;

        $rootScope.alerts = [];

        return alertService;

        function Add(type, msg) {
          $rootScope.alerts.push({'type': type, 'msg': msg});
        };

        function CloseAlert(index) {
          $rootScope.alerts.splice(index, 1);
        };

        function Clear(){
          $rootScope.alerts = [];
        }

    }