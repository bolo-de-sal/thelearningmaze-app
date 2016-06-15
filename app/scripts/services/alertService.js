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
        $rootScope.hideAlertMessage = false;

        return alertService;

        function Add(type, msg, clearMessages) {
            if(clearMessages){
                this.Clear();
            }
            $rootScope.alerts.push({'type': type, 'msg': msg});
        };

        function CloseAlert(index) {
            $rootScope.alerts.splice(index, 1);
        };

        function Clear(){
            $rootScope.alerts = [];
        }

    }